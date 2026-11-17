import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden text-2xl">☰</button>
        <h2 className="text-lg font-semibold text-gray-800">Tableau de bord</h2>
      </div>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2"
        >
          <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <span className="hidden md:block text-sm font-medium">{user?.firstName}</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-48 z-40">
            <div className="px-4 py-2 border-b text-xs text-gray-500">
              {user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </header>
  );
}