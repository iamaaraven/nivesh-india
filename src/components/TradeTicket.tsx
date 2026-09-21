import { useEffect, useState } from 'react';
import { INSTRUMENT_MAP } from '../data/instruments';
import type { OrderSide, Quote } from '../types';
import { cn, formatINR } from '../utils/format';

interface TradeTicketProps {
  symbol: string | null;
  quote: Quote | undefined;
  cash: number;
  holdingQty: number;
  onSubmit: (symbol: string, side: OrderSide, qty: number) => {
    ok: boolean;
    error?: string;
  };
  onClose?: () => void;
}

export function TradeTicket({
  symbol,
  quote,
  cash,
  holdingQty,
  onSubmit,
  onClose,
}: TradeTicketProps) {
  const [side, setSide] = useState<OrderSide>('BUY');
  const [qtyStr, setQtyStr] = useState('1');
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  useEffect(() => {
    setMsg(null);
    setQtyStr('1');
    setSide('BUY');
  }, [symbol]);

  if (!symbol || !quote) {
    return (
      <section className="panel trade-empty">
        <p>Select a stock or metal from the watchlist to place a paper trade.</p>
      </section>
    );
  }

  const inst = INSTRUMENT_MAP[symbol];
  const qty = parseInt(qtyStr, 10);
  const est = Number.isFinite(qty) && qty > 0 ? qty * quote.ltp : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onSubmit(symbol, side, qty);
    if (result.ok) {
      setMsg({
        type: 'ok',
        text: `${side} ${qty} ${symbol} @ ${formatINR(quote.ltp)} — Filled`,
      });
    } else {
      setMsg({ type: 'err', text: result.error ?? 'Order failed' });
    }
  };

  return (
    <section className="panel trade-ticket">
      <div className="ticket-head">
        <div>
          <h2>{symbol}</h2>
          <p className="muted">
            {inst?.name} · {inst?.exchange} · Market order
          </p>
        </div>
        {onClose && (
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        )}
      </div>

      <div className="ltp-row">
        <span className="label">LTP</span>
        <strong className="mono">{formatINR(quote.ltp)}</strong>
      </div>

      <div className="side-toggle">
        <button
          type="button"
          className={cn('buy', side === 'BUY' && 'active')}
          onClick={() => setSide('BUY')}
        >
          Buy
        </button>
        <button
          type="button"
          className={cn('sell', side === 'SELL' && 'active')}
          onClick={() => setSide('SELL')}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit} className="ticket-form">
        <label>
          Quantity ({inst?.unit ?? 'units'})
          <input
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={qtyStr}
            onChange={(e) => setQtyStr(e.target.value)}
          />
        </label>

        <div className="est-row">
          <span>Est. value</span>
          <strong className="mono">{formatINR(est)}</strong>
        </div>
        <div className="est-row muted small">
          <span>Available cash</span>
          <span>{formatINR(cash)}</span>
        </div>
        <div className="est-row muted small">
          <span>Holdings</span>
          <span>
            {holdingQty} {inst?.unit}
          </span>
        </div>

        <button
          type="submit"
          className={cn('submit-btn', side === 'BUY' ? 'buy' : 'sell')}
        >
          {side} {symbol}
        </button>
      </form>

      {msg && (
        <p className={cn('toast', msg.type === 'ok' ? 'ok' : 'err')}>{msg.text}</p>
      )}
    </section>
  );
}
