import { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import OrderCard from '../../components/domain/OrderCard';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import { ORDER_STATUS_LABELS } from '../../utils/constants';

export default function OrderListPage() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders({ status, page });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Commandes</h1>
        <select className="input-field w-48" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">Tous statuts</option>
          {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {isLoading ? <Loader /> : data?.data?.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((o) => <OrderCard key={o.id} order={o} />)}
          </div>
          <Pagination pagination={data.pagination} onChange={setPage} />
        </>
      ) : (
        <div className="card text-center text-gray-500">Aucune commande</div>
      )}
    </div>
  );
}