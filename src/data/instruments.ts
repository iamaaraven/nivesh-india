import type { Instrument } from '../types';

export const INITIAL_CASH = 1_000_000; // ₹10,00,000

export const INSTRUMENTS: Instrument[] = [
  // NSE Stocks — realistic ~Sep 2025 INR levels (illustrative seeds)
  { symbol: 'RELIANCE', name: 'Reliance Industries', assetClass: 'stock', exchange: 'NSE', seedPrice: 2985.5, lotSize: 1, unit: 'shares' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', assetClass: 'stock', exchange: 'NSE', seedPrice: 4120.0, lotSize: 1, unit: 'shares' },
  { symbol: 'INFY', name: 'Infosys', assetClass: 'stock', exchange: 'NSE', seedPrice: 1855.25, lotSize: 1, unit: 'shares' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', assetClass: 'stock', exchange: 'NSE', seedPrice: 1725.4, lotSize: 1, unit: 'shares' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', assetClass: 'stock', exchange: 'NSE', seedPrice: 1285.75, lotSize: 1, unit: 'shares' },
  { symbol: 'SBIN', name: 'State Bank of India', assetClass: 'stock', exchange: 'NSE', seedPrice: 825.3, lotSize: 1, unit: 'shares' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', assetClass: 'stock', exchange: 'NSE', seedPrice: 1680.9, lotSize: 1, unit: 'shares' },
  { symbol: 'ITC', name: 'ITC Limited', assetClass: 'stock', exchange: 'NSE', seedPrice: 478.55, lotSize: 1, unit: 'shares' },
  { symbol: 'LT', name: 'Larsen & Toubro', assetClass: 'stock', exchange: 'NSE', seedPrice: 3625.0, lotSize: 1, unit: 'shares' },
  { symbol: 'AXISBANK', name: 'Axis Bank', assetClass: 'stock', exchange: 'NSE', seedPrice: 1185.2, lotSize: 1, unit: 'shares' },
  // MCX Metals — INR
  { symbol: 'GOLD', name: 'Gold (10g)', assetClass: 'metal', exchange: 'MCX', seedPrice: 72580, lotSize: 1, unit: 'lots' },
  { symbol: 'SILVER', name: 'Silver (1kg)', assetClass: 'metal', exchange: 'MCX', seedPrice: 86500, lotSize: 1, unit: 'lots' },
  { symbol: 'COPPER', name: 'Copper (1kg)', assetClass: 'metal', exchange: 'MCX', seedPrice: 845.5, lotSize: 1, unit: 'lots' },
  { symbol: 'CRUDEOIL', name: 'Crude Oil (barrel)', assetClass: 'metal', exchange: 'MCX', seedPrice: 5820, lotSize: 1, unit: 'lots' },
];

export const INSTRUMENT_MAP = Object.fromEntries(
  INSTRUMENTS.map((i) => [i.symbol, i])
) as Record<string, Instrument>;

export const STOCKS = INSTRUMENTS.filter((i) => i.assetClass === 'stock');
export const METALS = INSTRUMENTS.filter((i) => i.assetClass === 'metal');
