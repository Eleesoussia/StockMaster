import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../components/common/Toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      notify.success('Compte créé !');
      navigate('/dashboard');
    } catch (err) {
      notify.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary-700 text-center mb-6">Créer un compte</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Prénom</label>
              <input className="input-field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div>
              <label className="label">Nom</label>
              <input className="input-field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input className="input-field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} required />
          </div>
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Création…' : "S'inscrire"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ? <Link to="/login" className="text-primary-600 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}