import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/domain/ProductCard';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';

export default function ProductListPage() {
  const { isStaff } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProducts({ search, categoryId, page });
  const { data: categories } = useCategories();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Produits</h1>
        {isStaff && (
          <Link to="/products/new" className="btn-primary">+ Nouveau produit</Link>
        )}
      </div>

      <div className="card flex flex-col md:flex-row gap-3">
        <input
          className="input-field flex-1"
          placeholder="Rechercher par nom ou SKU…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="input-field md:w-64"
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
        >
          <option value="">Toutes catégories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Loader />
      ) : data?.data?.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <Pagination pagination={data.pagination} onChange={setPage} />
        </>
      ) : (
        <div className="card text-center text-gray-500">Aucun produit trouvé</div>
      )}
    </div>
  );
}