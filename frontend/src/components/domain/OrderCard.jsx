import { Link } from 'react-router-dom';
import { formatPrice, formatDate } from '../../utils/formatters';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants';

export default function OrderCard({ order }) {
  return (
    <Link to={`/orders/${order.id}`} className="card hover:shadow-md transition block">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold">{order.orderNumber}</h3>
          <p className="text-xs text-gray-500">Créée le {formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>
      <div className="mt-3 flex justify-between text-sm">
        <span className="text-gray-600">{order.items?.length || 0} article(s)</span>
        <span className="font-bold text-primary-700">{formatPrice(order.totalAmount)}</span>
      </div>
    </Link>
  );
}