import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct, useCreateProduct, useUpdateProduct } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { data: product } = useProduct(id);
  const { data: categories } = useCategories();
  const create = useCreateProduct();
  const update = useUpdateProduct();

  const [form, setForm] = useState({
    name: '', sku: '', description: '', price: '', costPrice: '',
    stockQuantity: 0, alertThreshold: 10, categoryId: '',
  });

  useEffect(() => {
    if (isEdit && product) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        price: product.price || '',
        costPrice: product.costPrice || '',
        stockQuantity: product.stockQuantity ?? 0,
        alertThreshold: product.alertThreshold ?? 10,
        categoryId: product.categoryId || '',
      });
    }
  }, [isEdit, product]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      costPrice: form.costPrice ? parseFloat(form.costPrice) : null,
      stockQuantity: parseInt(form.stockQuantity),
      alertThreshold: parseInt(form.alertThreshold),
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
    };
    if (isEdit) await update.mutateAsync({ id, data: payload });
    else await create.mutateAsync(payload);
    navigate('/products');
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Modifier' : 'Créer'} un produit</h1>
      <form onSubmit={onSubmit} className="card space-y-3">
        <div>
          <label className="label">Nom *</label>
          <input name="name" className="input-field" value={form.name} onChange={onChange} required />
        </div>
        <div>
          <label className="label">SKU *</label>
          <input name="sku" className="input-field" value={form.sku} onChange={onChange} required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea name="description" className="input-field" rows={3} value={form.description} onChange={onChange} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Prix *</label>
            <input name="price" type="number" step="0.01" className="input-field" value={form.price} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Coût</label>
            <input name="costPrice" type="number" step="0.01" className="input-field" value={form.costPrice} onChange={onChange} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Stock</label>
            <input name="stockQuantity" type="number" className="input-field" value={form.stockQuantity} onChange={onChange} />
          </div>
          <div>
            <label className="label">Seuil alerte</label>
            <input name="alertThreshold" type="number" className="input-field" value={form.alertThreshold} onChange={onChange} />
          </div>
        </div>
        <div>
          <label className="label">Catégorie</label>
          <select name="categoryId" className="input-field" value={form.categoryId} onChange={onChange}>
            <option value="">— Aucune —</option>
            {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={() => navigate('/products')}>Annuler</button>
          <button className="btn-primary" disabled={create.isPending || update.isPending}>
            {isEdit ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}