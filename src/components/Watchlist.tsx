import { METALS, STOCKS } from '../data/instruments';
import type { Quote } from '../types';
import { cn, formatINR, formatPct, formatVolume } from '../utils/format';

interface WatchlistProps {
  quotes: Record<string, Quote>;
  assetTab: 'stocks' | 'metals';
  onAssetTab: (t: 'stocks' | 'metals') => void;
  selected: string | null;
  onSelect: (symbol: string) => void;
}

export function Watchlist({
  quotes,
  assetTab,
  onAssetTab,
  selected,
  onSelect,
}: WatchlistProps) {
  const list = assetTab === 'stocks' ? STOCKS : METALS;

  return (
    <section className="panel">
      <div className="segmented">
        <button
          type="button"
          className={cn(assetTab === 'stocks' && 'active')}
          onClick={() => onAssetTab('stocks')}
        >
          Stocks
        </button>
        <button
          type="button"
          className={cn(assetTab === 'metals' && 'active')}
          onClick={() => onAssetTab('metals')}
        >
          Metals
        </button>
      </div>

      <div className="list-head">
        <span>Instrument</span>
        <span className="text-right">LTP</span>
        <span className="text-right">Chg %</span>
      </div>

      <ul className="watch-list">
        {list.map((inst) => {
          const q = quotes[inst.symbol];
          if (!q) return null;
          const up = q.changePct >= 0;
          return (
            <li key={inst.symbol}>
              <button
                type="button"
                className={cn(
                  'watch-row',
                  selected === inst.symbol && 'selected'
                )}
                onClick={() => onSelect(inst.symbol)}
              >
                <div className="sym-block">
                  <strong>{inst.symbol}</strong>
                  <span className="muted">
                    {inst.exchange} · Vol {formatVolume(q.volume)}
                  </span>
                </div>
                <div className="text-right mono">
                  <strong>{formatINR(q.ltp)}</strong>
                  <span className="muted">{formatINR(q.change)}</span>
                </div>
                <div className={cn('chg-pill', up ? 'up' : 'down')}>
                  {formatPct(q.changePct)}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
