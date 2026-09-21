import { formatINR, formatPct, cn } from '../utils/format';

export interface HoldingRow {
  symbol: string;
  name: string;
  assetClass: string;
  qty: number;
  avgCost: number;
  ltp: number;
  marketValue: number;
  unrealized: number;
  unrealizedPct: number;
  dayPnl: number;
  dayPnlPct: number;
}

interface PortfolioProps {
  cash: number;
  invested: number;
  totalEquity: number;
  totalUnrealized: number;
  totalDayPnl: number;
  holdings: HoldingRow[];
  onSelect: (symbol: string) => void;
  onReset: () => void;
}

export function Portfolio({
  cash,
  invested,
  totalEquity,
  totalUnrealized,
  totalDayPnl,
  holdings,
  onSelect,
  onReset,
}: PortfolioProps) {
  return (
    <section className="panel">
      <div className="portfolio-summary">
        <div className="stat">
          <span className="label">Total equity</span>
          <strong>{formatINR(totalEquity)}</strong>
        </div>
        <div className="stat">
          <span className="label">Cash</span>
          <strong>{formatINR(cash)}</strong>
        </div>
        <div className="stat">
          <span className="label">Invested</span>
          <strong>{formatINR(invested)}</strong>
        </div>
        <div className="stat">
          <span className="label">Unrealized P&amp;L</span>
          <strong className={totalUnrealized >= 0 ? 'up' : 'down'}>
            {formatINR(totalUnrealized)}
          </strong>
        </div>
        <div className="stat">
          <span className="label">Day P&amp;L</span>
          <strong className={totalDayPnl >= 0 ? 'up' : 'down'}>
            {formatINR(totalDayPnl)}
          </strong>
        </div>
      </div>

      <div className="section-title-row">
        <h2>Holdings</h2>
        <button type="button" className="link-btn" onClick={onReset}>
          Reset demo
        </button>
      </div>

      {holdings.length === 0 ? (
        <p className="empty">No holdings yet. Buy from the watchlist to start.</p>
      ) : (
        <ul className="holdings-list">
          {holdings.map((h) => (
            <li key={h.symbol}>
              <button
                type="button"
                className="holding-card"
                onClick={() => onSelect(h.symbol)}
              >
                <div className="holding-top">
                  <div>
                    <strong>{h.symbol}</strong>
                    <span className="muted">
                      {h.qty} · Avg {formatINR(h.avgCost)}
                    </span>
                  </div>
                  <div className="text-right">
                    <strong className="mono">{formatINR(h.marketValue)}</strong>
                    <span className={cn(h.unrealized >= 0 ? 'up' : 'down')}>
                      {formatINR(h.unrealized)} ({formatPct(h.unrealizedPct)})
                    </span>
                  </div>
                </div>
                <div className="holding-meta">
                  <span>LTP {formatINR(h.ltp)}</span>
                  <span className={cn(h.dayPnl >= 0 ? 'up' : 'down')}>
                    Day {formatINR(h.dayPnl)} ({formatPct(h.dayPnlPct)})
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
