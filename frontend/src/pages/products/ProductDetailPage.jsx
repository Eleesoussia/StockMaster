import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct, useDeleteProduct } from '../../hooks/useProducts';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isStaff } = useAuth();
  const { data: product, isLoading } = useProduct(id);
  const del = useDeleteProduct();
  const [confirm, setConfirm] = useState(false);

  if (isLoading) return <Loader />;
  if (!product) return <div className="card">Produit introuvable</div>;

  const onDelete = async () => {
    await del.mutateAsync(product.id);
    navigate('/products');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        {isStaff && (
          <div className="flex gap-2">
            <Link to={`/products/${product.id}/edit`} className="btn-secondary">Modifier</Link>
            <Button variant="danger" onClick={() => setConfirm(true)}>Supprimer</Button>
          </div>
        )}
      </div>

      <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold mb-2">Informations</h2>
          <dl className="space-y-1 text-sm">
            <div><dt className="text-gray-500 inline">SKU : </dt><dd className="inline font-medium">{product.sku}</dd></div>
            <div><dt className="text-gray-500 inline">Catégorie : </dt><dd className="inline font-medium">{product.category?.name || '—'}</dd></div>
            <div><dt className="text-gray-500 inline">Prix : </dt><dd className="inline font-bold text-primary-700">{formatPrice(product.price)}</dd></div>
            <div><dt className="text-gray-500 inline">Coût : </dt><dd className="inline">{formatPrice(product.costPrice)}</dd></div>
          </dl>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Stock</h2>
          <dl className="space-y-1 text-sm">
            <div><dt className="text-gray-500 inline">Quantité : </dt><dd className="inline font-bold">{product.stockQuantity}</dd></div>
            <div><dt className="text-gray-500 inline">Seuil alerte : </dt><dd className="inline">{product.alertThreshold}</dd></div>
            <div><dt className="text-gray-500 inline">Statut : </dt><dd className="inline">{product.isActive ? 'Actif' : 'Inactif'}</dd></div>
          </dl>
        </div>
        {product.description && (
          <div className="md:col-span-2">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-sm text-gray-700">{product.description}</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={onDelete}
        loading={del.isPending}
        title="Supprimer ce produit ?"
        message="Cette action est irréversible."
      />
    </div>
  );
}