import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const link = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
    isActive ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
  }`;

export default function Sidebar({ onNavigate }) {
  const { isStaff, user } = useAuth();

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 flex flex-col">
      <div className="mb-6 px-2">
        <h1 className="text-2xl font-bold text-primary-700">StockMaster</h1>
        <p className="text-xs text-gray-500">Gestion d'inventaire</p>
      </div>

      <nav className="flex-1 space-y-1" onClick={onNavigate}>
        <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
        <NavLink to="/products" className={link}> Produits</NavLink>
        <NavLink to="/categories" className={link}>Catégories</NavLink>
        <NavLink to="/cart" className={link}>Panier</NavLink>
        <NavLink to="/orders" className={link}>Commandes</NavLink>
        {isStaff && <NavLink to="/stock" className={link}>Stocks & Alertes</NavLink>}
      </nav>

      <div className="border-t pt-4 mt-4 px-2 text-xs text-gray-500">
        Connecté : <strong>{user?.firstName} {user?.lastName}</strong>
        <br />
        Rôle : <span className="font-semibold">{user?.role}</span>
      </div>
    </aside>
  );
}