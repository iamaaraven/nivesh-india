# Nivesh — Stocks & Metals for India

**Paper / demo trading MVP** for Indian equities (NSE-style) and metals (MCX-style). Built to feel like a modern Indian broker app — without real money, live market data, or SEBI registration.

> **Disclaimer:** Paper trading demo only. **Not** a SEBI-registered broker. **Not** real money. Prices are simulated in the browser for education and UX demonstration.

## Features

- **Watchlist** — Stocks | Metals tabs
  - Stocks: RELIANCE, TCS, INFY, HDFCBANK, ICICIBANK, SBIN, BHARTIARTL, ITC, LT, AXISBANK
  - Metals: GOLD, SILVER, COPPER, CRUDEOIL (INR)
- **Simulated live prices** — realistic INR seed prices with a random walk every ~2.5s; clear **PAPER TRADING** badge
- **Trade ticket** — Buy / Sell market orders, instant fill at current simulated LTP, cash & holdings validation
- **Portfolio** — starting cash ₹10,00,000; holdings with avg cost, LTP, unrealized P&L, day P&L; persists in `localStorage`
- **Orders** — filled paper order history
- **Mobile-first UI** — dark fintech look, green/red ticks, Indian-style ₹ / lakhs formatting

## Tech

- Vite + React + TypeScript
- Single-page app — **no backend**, no API keys
- State persisted in browser `localStorage`

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

## Project layout

```
src/
  components/   # Header, Watchlist, TradeTicket, Portfolio, Orders, BottomNav
  data/         # Instrument seeds (NSE / MCX style)
  hooks/        # Simulated prices + portfolio / orders
  utils/        # INR formatting helpers
  App.tsx
```

## Roadmap (high level — not implemented)

Real brokerage is a regulated path. A future production product would need, among other things:

1. **KYC / account opening** — customer due diligence, e-KYC, bank linking
2. **Exchange connectivity** — NSE / BSE / MCX market data and order routing via licensed vendors
3. **SEBI registration** — stock broker / trading member (or partner with an existing broker), compliance, audits
4. **Risk, OMS, clearing** — order management, margins, settlements, surveillance
5. **Security & infra** — auth, encryption, uptime, disaster recovery

This repo is intentionally a **browser-only paper MVP** so anyone can try the UX without keys or servers.

## License

MIT — demo / educational use. Not affiliated with NSE, BSE, MCX, Zerodha, Groww, or any broker.
