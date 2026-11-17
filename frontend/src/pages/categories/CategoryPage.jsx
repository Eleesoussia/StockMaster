import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/useCategories';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function CategoryPage() {
  const { isStaff } = useAuth();
  const { data: categories, isLoading } = useCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const del = useDeleteCategory();

  const [modal, setModal] = useState({ open: false, mode: 'create', category: null });
  const [confirm, setConfirm] = useState({ open: false, category: null });
  const [form, setForm] = useState({ name: '', description: '', parentId: '' });

  const openCreate = () => {
    setForm({ name: '', description: '', parentId: '' });
    setModal({ open: true, mode: 'create', category: null });
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '', parentId: cat.parentId || '' });
    setModal({ open: true, mode: 'edit', category: cat });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || null,
      parentId: form.parentId ? parseInt(form.parentId) : null,
    };
    if (modal.mode === 'edit') await update.mutateAsync({ id: modal.category.id, data: payload });
    else await create.mutateAsync(payload);
    setModal({ open: false });
  };

  const onDelete = async () => {
    await del.mutateAsync(confirm.category.id);
    setConfirm({ open: false, category: null });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Catégories</h1>
        {isStaff && <button className="btn-primary" onClick={openCreate}>+ Nouvelle catégorie</button>}
      </div>

      <div className="card space-y-2">
        {categories?.length ? (
          categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
              <div>
                <p className="font-medium">{cat.name}</p>
                {cat.parent && <p className="text-xs text-gray-500">Parent : {cat.parent.name}</p>}
              </div>
              {isStaff && (
                <div className="flex gap-2">
                  <button className="text-xs text-primary-600" onClick={() => openEdit(cat)}>Modifier</button>
                  <button className="text-xs text-red-600" onClick={() => setConfirm({ open: true, category: cat })}>Supprimer</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">Aucune catégorie</p>
        )}
      </div>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.mode === 'edit' ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal({ open: false })}>Annuler</button>
            <button className="btn-primary" onClick={onSubmit}>
              {modal.mode === 'edit' ? 'Enregistrer' : 'Créer'}
            </button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label">Nom *</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input-field" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Catégorie parente</label>
            <select className="input-field" value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
              <option value="">— Aucune —</option>
              {categories?.filter((c) => !modal.category || c.id !== modal.category.id).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, category: null })}
        onConfirm={onDelete}
        loading={del.isPending}
        title="Supprimer cette catégorie ?"
        message="Cette action est irréversible."
      />
    </div>
  );
}