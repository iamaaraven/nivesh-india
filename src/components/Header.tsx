import { formatINR } from '../utils/format';

interface HeaderProps {
  equity: number;
  dayPnl: number;
}

export function Header({ equity, dayPnl }: HeaderProps) {
  const up = dayPnl >= 0;
  return (
    <header className="app-header">
      <div className="brand-row">
        <div className="brand">
          <span className="brand-mark">न</span>
          <div>
            <h1>Nivesh</h1>
            <p className="tagline">Stocks &amp; Metals for India</p>
          </div>
        </div>
        <span className="paper-badge" title="Simulated prices — no real money">
          PAPER TRADING
        </span>
      </div>
      <div className="equity-strip">
        <div>
          <span className="label">Portfolio</span>
          <strong>{formatINR(equity, 0)}</strong>
        </div>
        <div className="text-right">
          <span className="label">Day P&amp;L</span>
          <strong className={up ? 'up' : 'down'}>
            {up ? '+' : ''}
            {formatINR(dayPnl)}
          </strong>
        </div>
      </div>
    </header>
  );
}
