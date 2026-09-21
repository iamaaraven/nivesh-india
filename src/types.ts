export type AssetClass = 'stock' | 'metal';

export interface Instrument {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  exchange: 'NSE' | 'MCX';
  seedPrice: number;
  lotSize: number;
  unit: string;
}

export interface Quote {
  symbol: string;
  ltp: number;
  open: number;
  change: number;
  changePct: number;
  volume: number;
  high: number;
  low: number;
}

export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'Filled';

export interface Order {
  id: string;
  symbol: string;
  name: string;
  side: OrderSide;
  qty: number;
  price: number;
  value: number;
  status: OrderStatus;
  timestamp: number;
  assetClass: AssetClass;
}

export interface Holding {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  qty: number;
  avgCost: number;
  dayOpenValue: number; // qty * open price at first buy of day or session open LTP
}

export interface PortfolioState {
  cash: number;
  holdings: Holding[];
  orders: Order[];
  startedAt: number;
}

export type TabId = 'watchlist' | 'portfolio' | 'orders' | 'trade';
