import { useState } from 'react';
import { useStats, useSalesByDay, useTopProducts } from '../../hooks/useDashboard';
import Loader from '../../components/common/Loader';
import { formatPrice } from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function StatCard({ label, value, color = 'bg-primary-600' }) {
  return (
    <div className="card">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${color.replace('bg-', 'text-')}`}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [period, setPeriod] = useState('7days');
  const { data: stats, isLoading } = useStats();
  const { data: sales } = useSalesByDay(period);
  const { data: top } = useTopProducts(5);

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <select 
          className="input-field w-48 bg-white" 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="today">Aujourd'hui</option>
          <option value="7days">7 derniers jours</option>
          <option value="30days">30 derniers jours</option>
          <option value="year">Cette année</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Produits actifs" value={stats?.totalProducts ?? 0} />
        <StatCard label="Commandes" value={stats?.totalOrders ?? 0} />
        <StatCard label="Alertes non lues" value={stats?.activeAlerts ?? 0} />
        <StatCard label="Chiffre d'affaires" value={formatPrice(stats?.totalRevenue)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Valeur du stock" value={formatPrice(stats?.totalStockValue)} />
        <StatCard label="Produits en rupture" value={stats?.outOfStockCount ?? 0} />
        <StatCard label="Produits en stock bas" value={stats?.lowStockCount ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Ventes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sales || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Top 5 produits vendus</h2>
          {top?.length ? (
            <ul className="space-y-2">
              {top.map((p, i) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <span>{i + 1}. {p.name}</span>
                  <span className="font-semibold">{p.total_sold} vendus</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Aucune vente</p>
          )}
        </div>
      </div>
    </div>
  );
}