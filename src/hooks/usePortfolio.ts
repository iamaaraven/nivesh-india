import { useCallback, useEffect, useMemo, useState } from 'react';
import { INITIAL_CASH, INSTRUMENT_MAP } from '../data/instruments';
import type {
  Holding,
  Order,
  OrderSide,
  PortfolioState,
  Quote,
} from '../types';

const STORAGE_KEY = 'nivesh-portfolio-v1';

function defaultState(): PortfolioState {
  return {
    cash: INITIAL_CASH,
    holdings: [],
    orders: [],
    startedAt: Date.now(),
  };
}

function loadState(): PortfolioState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as PortfolioState;
    if (typeof parsed.cash !== 'number' || !Array.isArray(parsed.holdings)) {
      return defaultState();
    }
    return parsed;
  } catch {
    return defaultState();
  }
}

export interface PlaceOrderResult {
  ok: boolean;
  error?: string;
  order?: Order;
}

export function usePortfolio(quotes: Record<string, Quote>) {
  const [state, setState] = useState<PortfolioState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const placeOrder = useCallback(
    (symbol: string, side: OrderSide, qty: number): PlaceOrderResult => {
      const inst = INSTRUMENT_MAP[symbol];
      const quote = quotes[symbol];
      if (!inst || !quote) return { ok: false, error: 'Unknown instrument' };
      if (!Number.isFinite(qty) || qty <= 0 || !Number.isInteger(qty)) {
        return { ok: false, error: 'Enter a valid whole-number quantity' };
      }

      const price = quote.ltp;
      const value = price * qty;

      let error: string | undefined;
      setState((prev) => {
        if (side === 'BUY') {
          if (value > prev.cash + 1e-9) {
            error = `Insufficient cash. Need ${value.toFixed(2)}, have ${prev.cash.toFixed(2)}`;
            return prev;
          }
          const existing = prev.holdings.find((h) => h.symbol === symbol);
          let holdings: Holding[];
          if (existing) {
            const newQty = existing.qty + qty;
            const newAvg =
              (existing.avgCost * existing.qty + price * qty) / newQty;
            holdings = prev.holdings.map((h) =>
              h.symbol === symbol
                ? {
                    ...h,
                    qty: newQty,
                    avgCost: newAvg,
                    dayOpenValue: h.dayOpenValue + quote.open * qty,
                  }
                : h
            );
          } else {
            holdings = [
              ...prev.holdings,
              {
                symbol,
                name: inst.name,
                assetClass: inst.assetClass,
                qty,
                avgCost: price,
                dayOpenValue: quote.open * qty,
              },
            ];
          }
          const order: Order = {
            id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            symbol,
            name: inst.name,
            side,
            qty,
            price,
            value,
            status: 'Filled',
            timestamp: Date.now(),
            assetClass: inst.assetClass,
          };
          return {
            ...prev,
            cash: prev.cash - value,
            holdings,
            orders: [order, ...prev.orders],
          };
        }

        // SELL
        const existing = prev.holdings.find((h) => h.symbol === symbol);
        if (!existing || existing.qty < qty) {
          error = `Insufficient holdings. You have ${existing?.qty ?? 0}`;
          return prev;
        }
        const newQty = existing.qty - qty;
        const holdings =
          newQty === 0
            ? prev.holdings.filter((h) => h.symbol !== symbol)
            : prev.holdings.map((h) =>
                h.symbol === symbol
                  ? {
                      ...h,
                      qty: newQty,
                      dayOpenValue: (h.dayOpenValue / h.qty) * newQty,
                    }
                  : h
              );
        const order: Order = {
          id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          symbol,
          name: inst.name,
          side,
          qty,
          price,
          value,
          status: 'Filled',
          timestamp: Date.now(),
          assetClass: inst.assetClass,
        };
        return {
          ...prev,
          cash: prev.cash + value,
          holdings,
          orders: [order, ...prev.orders],
        };
      });

      if (error) return { ok: false, error };

      const order: Order = {
        id: 'pending',
        symbol,
        name: inst.name,
        side,
        qty,
        price,
        value,
        status: 'Filled',
        timestamp: Date.now(),
        assetClass: inst.assetClass,
      };
      return { ok: true, order };
    },
    [quotes]
  );

  const resetPortfolio = useCallback(() => {
    const fresh = defaultState();
    setState(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }, []);

  const holdingsView = useMemo(() => {
    return state.holdings.map((h) => {
      const q = quotes[h.symbol];
      const ltp = q?.ltp ?? h.avgCost;
      const open = q?.open ?? h.avgCost;
      const marketValue = ltp * h.qty;
      const costValue = h.avgCost * h.qty;
      const unrealized = marketValue - costValue;
      const unrealizedPct = costValue > 0 ? (unrealized / costValue) * 100 : 0;
      const dayPnl = marketValue - open * h.qty;
      const dayPnlPct = open > 0 ? (dayPnl / (open * h.qty)) * 100 : 0;
      return {
        ...h,
        ltp,
        marketValue,
        costValue,
        unrealized,
        unrealizedPct,
        dayPnl,
        dayPnlPct,
      };
    });
  }, [state.holdings, quotes]);

  const invested = holdingsView.reduce((s, h) => s + h.marketValue, 0);
  const totalUnrealized = holdingsView.reduce((s, h) => s + h.unrealized, 0);
  const totalDayPnl = holdingsView.reduce((s, h) => s + h.dayPnl, 0);
  const totalEquity = state.cash + invested;

  return {
    cash: state.cash,
    orders: state.orders,
    holdings: holdingsView,
    invested,
    totalUnrealized,
    totalDayPnl,
    totalEquity,
    placeOrder,
    resetPortfolio,
    startedAt: state.startedAt,
  };
}
