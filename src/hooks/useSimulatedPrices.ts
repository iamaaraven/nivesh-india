import { useCallback, useEffect, useRef, useState } from 'react';
import { INSTRUMENTS } from '../data/instruments';
import type { Quote } from '../types';

function seedQuotes(): Record<string, Quote> {
  const map: Record<string, Quote> = {};
  for (const inst of INSTRUMENTS) {
    const open = inst.seedPrice;
    const volume =
      inst.assetClass === 'stock'
        ? Math.floor(500_000 + Math.random() * 4_500_000)
        : Math.floor(1_000 + Math.random() * 25_000);
    map[inst.symbol] = {
      symbol: inst.symbol,
      ltp: open,
      open,
      change: 0,
      changePct: 0,
      volume,
      high: open,
      low: open,
    };
  }
  return map;
}

function randomWalk(q: Quote, assetClass: 'stock' | 'metal'): Quote {
  // Stocks ~0.05–0.25% tick; metals slightly tighter relative moves
  const vol = assetClass === 'metal' ? 0.0012 : 0.002;
  const shock = (Math.random() - 0.5) * 2 * vol;
  const next = Math.max(0.01, q.ltp * (1 + shock));
  const rounded =
    next >= 1000 ? Math.round(next * 10) / 10 : Math.round(next * 100) / 100;
  const change = rounded - q.open;
  const changePct = (change / q.open) * 100;
  const volBump = Math.floor(Math.random() * (assetClass === 'stock' ? 8000 : 40));
  return {
    ...q,
    ltp: rounded,
    change,
    changePct,
    high: Math.max(q.high, rounded),
    low: Math.min(q.low, rounded),
    volume: q.volume + volBump,
  };
}

const INTERVAL_MS = 2500;

export function useSimulatedPrices() {
  const [quotes, setQuotes] = useState<Record<string, Quote>>(seedQuotes);
  const running = useRef(true);

  useEffect(() => {
    running.current = true;
    const id = window.setInterval(() => {
      if (!running.current) return;
      setQuotes((prev) => {
        const next: Record<string, Quote> = {};
        for (const inst of INSTRUMENTS) {
          next[inst.symbol] = randomWalk(prev[inst.symbol], inst.assetClass);
        }
        return next;
      });
    }, INTERVAL_MS);
    return () => {
      running.current = false;
      window.clearInterval(id);
    };
  }, []);

  const getQuote = useCallback(
    (symbol: string) => quotes[symbol],
    [quotes]
  );

  return { quotes, getQuote };
}
