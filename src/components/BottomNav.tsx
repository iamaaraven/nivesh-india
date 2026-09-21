import type { TabId } from '../types';
import { cn } from '../utils/format';

interface BottomNavProps {
  tab: TabId;
  onTab: (t: TabId) => void;
}

const ITEMS: { id: TabId; label: string; icon: string }[] = [
  { id: 'watchlist', label: 'Watchlist', icon: '◉' },
  { id: 'trade', label: 'Trade', icon: '⇄' },
  { id: 'portfolio', label: 'Portfolio', icon: '▣' },
  { id: 'orders', label: 'Orders', icon: '☰' },
];

export function BottomNav({ tab, onTab }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={cn(tab === item.id && 'active')}
          onClick={() => onTab(item.id)}
        >
          <span className="nav-icon" aria-hidden>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
