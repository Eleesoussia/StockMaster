import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';

export default function ProductCard({ product }) {
  const low = product.stockQuantity > 0 && product.stockQuantity <= product.alertThreshold;
  const out = product.stockQuantity === 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="card hover:shadow-md transition flex flex-col"
    >
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          {out ? (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Rupture</span>
          ) : low ? (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Bas</span>
          ) : null}
        </div>
        <p className="text-xs text-gray-500 mt-1">SKU : {product.sku}</p>
        {product.category && (
          <p className="text-xs text-gray-500">Catégorie : {product.category.name}</p>
        )}
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-lg font-bold text-primary-700">{formatPrice(product.price)}</span>
        <span className="text-xs text-gray-500">Stock : {product.stockQuantity}</span>
      </div>
    </Link>
  );
}