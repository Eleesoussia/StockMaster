import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCreateOrder } from '../../hooks/useOrders';
import { formatPrice } from '../../utils/formatters';
import { notify } from '../../components/common/Toast';

export default function CartPage() {
  const navigate = useNavigate();
  const { data } = useProducts({ page: 1, limit: 50 });
  const createOrder = useCreateOrder();
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const addToCart = (product) => {
    if (product.stockQuantity === 0) return notify.error('Produit en rupture');
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stockQuantity) return notify.error('Stock max atteint');
      setItems(items.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setItems([...items, { productId: product.id, quantity: 1, product }]);
    }
  };

  const remove = (id) => setItems(items.filter((i) => i.productId !== id));
  const changeQty = (id, qty) => {
    if (qty < 1) return;
    setItems(items.map((i) => i.productId === id ? { ...i, quantity: qty } : i));
  };

  const total = items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0);

  const onSubmit = async () => {
    if (items.length === 0) return notify.error('Panier vide');
    if (!address.trim()) return notify.error('Adresse requise');
    const payload = {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      shippingAddress: address,
      notes: notes || null,
    };
    const res = await createOrder.mutateAsync(payload);
    navigate(`/orders/${res.data.data.id}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-2">
          <h2 className="font-semibold">Catalogue</h2>
          {data?.data?.map((p) => (
            <div key={p.id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-gray-500">Stock : {p.stockQuantity} · {formatPrice(p.price)}</p>
              </div>
              <button className="btn-primary text-sm" onClick={() => addToCart(p)} disabled={p.stockQuantity === 0}>
                + Ajouter
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold">Panier ({items.length})</h2>
          <div className="card space-y-2">
            {items.length === 0 ? (
              <p className="text-gray-500 text-sm">Panier vide</p>
            ) : (
              items.map((i) => (
                <div key={i.productId} className="flex items-center justify-between gap-2 border-b pb-2 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{i.product.name}</p>
                    <p className="text-xs text-gray-500">{formatPrice(i.product.price)}</p>
                  </div>
                  <input type="number" min="1" max={i.product.stockQuantity} value={i.quantity}
                    onChange={(e) => changeQty(i.productId, parseInt(e.target.value))}
                    className="w-16 border rounded px-2 py-1 text-sm" />
                  <button onClick={() => remove(i.productId)} className="text-red-600 text-sm">×</button>
                </div>
              ))
            )}
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary-700">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="card space-y-2">
            <label className="label">Adresse de livraison *</label>
            <textarea className="input-field" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
            <label className="label">Notes</label>
            <textarea className="input-field" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            <button className="btn-primary w-full" onClick={onSubmit} disabled={createOrder.isPending || items.length === 0}>
              {createOrder.isPending ? 'Commande…' : 'Passer la commande'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}