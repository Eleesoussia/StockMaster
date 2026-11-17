export default function StockAlert({ alert, onMarkRead }) {
  return (
    <div className={`p-3 rounded-lg border-l-4 ${alert.isRead ? 'bg-gray-50 border-gray-300' : 'bg-yellow-50 border-yellow-500'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{alert.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            Produit : {alert.product?.name || '—'}
          </p>
        </div>
        {!alert.isRead && onMarkRead && (
          <button
            onClick={() => onMarkRead(alert.id)}
            className="text-xs text-primary-600 hover:underline whitespace-nowrap"
          >
            Marquer lu
          </button>
        )}
      </div>
    </div>
  );
}