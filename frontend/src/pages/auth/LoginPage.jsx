import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../components/common/Toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      notify.success('Connecté !');
      navigate('/dashboard');
    } catch (err) {
      notify.error(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-700">StockMaster</h1>
          <p className="text-gray-500 mt-1">Gestion d'inventaire</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Pas de compte ? <Link to="/register" className="text-primary-600 hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}