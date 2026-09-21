import { useMemo, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { Disclaimer } from './components/Disclaimer';
import { Header } from './components/Header';
import { Orders } from './components/Orders';
import { Portfolio } from './components/Portfolio';
import { TradeTicket } from './components/TradeTicket';
import { Watchlist } from './components/Watchlist';
import { usePortfolio } from './hooks/usePortfolio';
import { useSimulatedPrices } from './hooks/useSimulatedPrices';
import type { TabId } from './types';

export default function App() {
  const { quotes } = useSimulatedPrices();
  const portfolio = usePortfolio(quotes);

  const [tab, setTab] = useState<TabId>('watchlist');
  const [assetTab, setAssetTab] = useState<'stocks' | 'metals'>('stocks');
  const [selected, setSelected] = useState<string | null>('RELIANCE');

  const holdingQty = useMemo(() => {
    if (!selected) return 0;
    return portfolio.holdings.find((h) => h.symbol === selected)?.qty ?? 0;
  }, [portfolio.holdings, selected]);

  const selectAndTrade = (symbol: string) => {
    setSelected(symbol);
    setTab('trade');
  };

  return (
    <div className="app-shell">
      <Header equity={portfolio.totalEquity} dayPnl={portfolio.totalDayPnl} />

      <main className="main">
        {tab === 'watchlist' && (
          <Watchlist
            quotes={quotes}
            assetTab={assetTab}
            onAssetTab={setAssetTab}
            selected={selected}
            onSelect={selectAndTrade}
          />
        )}

        {tab === 'trade' && (
          <TradeTicket
            symbol={selected}
            quote={selected ? quotes[selected] : undefined}
            cash={portfolio.cash}
            holdingQty={holdingQty}
            onSubmit={portfolio.placeOrder}
          />
        )}

        {tab === 'portfolio' && (
          <Portfolio
            cash={portfolio.cash}
            invested={portfolio.invested}
            totalEquity={portfolio.totalEquity}
            totalUnrealized={portfolio.totalUnrealized}
            totalDayPnl={portfolio.totalDayPnl}
            holdings={portfolio.holdings}
            onSelect={selectAndTrade}
            onReset={portfolio.resetPortfolio}
          />
        )}

        {tab === 'orders' && <Orders orders={portfolio.orders} />}

        <Disclaimer />
      </main>

      <BottomNav tab={tab} onTab={setTab} />
    </div>
  );
}
