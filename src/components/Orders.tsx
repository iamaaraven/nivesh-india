import type { Order } from '../types';
import { cn, formatINR, formatTime } from '../utils/format';

interface OrdersProps {
  orders: Order[];
}

export function Orders({ orders }: OrdersProps) {
  return (
    <section className="panel">
      <h2 className="section-title">Orders</h2>
      {orders.length === 0 ? (
        <p className="empty">No paper orders yet.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((o) => (
            <li key={o.id} className="order-card">
              <div className="order-top">
                <div>
                  <span className={cn('side-tag', o.side === 'BUY' ? 'buy' : 'sell')}>
                    {o.side}
                  </span>
                  <strong> {o.symbol}</strong>
                </div>
                <span className="status-pill">Filled</span>
              </div>
              <div className="order-meta">
                <span>
                  {o.qty} @ {formatINR(o.price)}
                </span>
                <span className="mono">{formatINR(o.value)}</span>
              </div>
              <div className="order-time muted">{formatTime(o.timestamp)}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
