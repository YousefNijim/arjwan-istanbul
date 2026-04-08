import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, setToken } from '@/lib/adminApi';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await adminApi.login(username, password);
      setToken(token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[hsl(43_76%_52%)] font-display text-2xl tracking-[0.3em]">ARJWAN</p>
          <p className="text-muted-foreground text-xs tracking-widest mt-1">ADMIN PANEL</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-8 space-y-5">
          <h1 className="text-foreground font-display text-xl tracking-wider mb-2">Sign In</h1>
          {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-sm">{error}</p>}
          <div>
            <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">Username</label>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              required autoFocus
              className="w-full bg-secondary border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-secondary border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-[hsl(43_76%_52%)] text-black py-3 text-sm tracking-widest uppercase font-medium hover:bg-[hsl(43_76%_60%)] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-muted-foreground/40 text-xs mt-6">
          <a href="/" className="hover:text-muted-foreground transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
