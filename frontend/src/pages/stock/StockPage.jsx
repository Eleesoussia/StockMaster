import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockApi } from '../../api/stockApi';
import { useProducts } from '../../hooks/useProducts';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import StockAlert from '../../components/domain/StockAlert';
import { formatDateTime } from '../../utils/formatters';
import { MOVEMENT_TYPE_LABELS } from '../../utils/constants';
import { notify } from '../../components/common/Toast';

export default function StockPage() {
  const qc = useQueryClient();
  const { data: productsData } = useProducts({ limit: 50 });

  const { data: movements, isLoading: lm } = useQuery({
    queryKey: ['movements'],
    queryFn: () => stockApi.listMovements({ page: 1, limit: 20 }).then((r) => r.data),
  });

  const { data: alerts, isLoading: la } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => stockApi.listAlerts({ page: 1, limit: 20 }).then((r) => r.data),
  });

  const [modal, setModal] = useState({ open: false });
  const [form, setForm] = useState({ productId: '', type: 'IN', quantity: 1, reason: '' });

  const createMovement = useMutation({
    mutationFn: stockApi.createMovement,
    onSuccess: () => {
      qc.invalidateQueries(['movements']);
      qc.invalidateQueries(['alerts']);
      qc.invalidateQueries(['products']);
      qc.invalidateQueries(['dashboard']);
      notify.success('Mouvement enregistré');
      setModal({ open: false });
    },
    onError: (e) => notify.error(e.response?.data?.message || 'Erreur'),
  });

  const markRead = useMutation({
    mutationFn: stockApi.markAlertRead,
    onSuccess: () => qc.invalidateQueries(['alerts']),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    createMovement.mutate({
      productId: parseInt(form.productId),
      type: form.type,
      quantity: parseInt(form.quantity),
      reason: form.reason || null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stocks & Alertes</h1>
        <button className="btn-primary" onClick={() => setModal({ open: true })}>+ Mouvement</button>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Alertes actives</h2>
        {la ? <Loader /> : alerts?.data?.length ? (
          <div className="space-y-2">
            {alerts.data.map((a) => (
              <StockAlert key={a.id} alert={a} onMarkRead={(id) => markRead.mutate(id)} />
            ))}
          </div>
        ) : <div className="card text-center text-gray-500">Aucune alerte</div>}
      </div>

      <div>
        <h2 className="font-semibold mb-2">Historique des mouvements</h2>
        {lm ? <Loader /> : (
          <Table
            data={movements?.data || []}
            emptyText="Aucun mouvement"
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'product', label: 'Produit', render: (r) => r.product?.name },
              { key: 'type', label: 'Type', render: (r) => MOVEMENT_TYPE_LABELS[r.type] },
              { key: 'quantity', label: 'Qté' },
              { key: 'newStock', label: 'Stock après' },
              { key: 'reason', label: 'Raison' },
              { key: 'createdAt', label: 'Date', render: (r) => formatDateTime(r.createdAt) },
            ]}
          />
        )}
      </div>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title="Nouveau mouvement de stock"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal({ open: false })}>Annuler</button>
            <button className="btn-primary" onClick={onSubmit} disabled={createMovement.isPending}>
              {createMovement.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label">Produit *</label>
            <select className="input-field" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} required>
              <option value="">— Choisir —</option>
              {productsData?.data?.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (stock: {p.stockQuantity})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Type *</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="IN">Entrée</option>
                <option value="OUT">Sortie</option>
                <option value="ADJUSTMENT">Ajustement</option>
              </select>
            </div>
            <div>
              <label className="label">Quantité *</label>
              <input type="number" min="1" className="input-field" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="label">Raison</label>
            <input className="input-field" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </div>
        </form>
      </Modal>
    </div>
  );
}