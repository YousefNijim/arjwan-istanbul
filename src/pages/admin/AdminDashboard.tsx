import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Tag, TrendingUp } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

const StatCard = ({ icon: Icon, label, value, sub, color }: any) => (
  <div className="bg-card border border-border rounded-sm p-5">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-sm ${color}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-2xl font-display text-foreground">{value ?? '—'}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    {sub && <p className="text-xs text-muted-foreground/50 mt-1">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getStats().then(setStats).catch(e => setError(e.message));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground tracking-wider mb-6">Dashboard</h1>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Active Products" value={stats?.activePerfumes} sub={`${stats?.totalPerfumes} total`} color="bg-[hsl(43_76%_52%/0.15)] text-[hsl(43_76%_52%)]" />
        <StatCard icon={ShoppingBag} label="New Orders" value={stats?.newOrders} sub={`${stats?.totalOrders} total`} color="bg-[hsl(270_52%_34%/0.3)] text-[hsl(270_52%_65%)]" />
        <StatCard icon={TrendingUp} label="Today's Orders" value={stats?.todayOrders} sub={`${stats?.todayRevenue?.toLocaleString()} TL revenue`} color="bg-green-500/10 text-green-400" />
        <StatCard icon={Tag} label="Active Offers" value={stats?.activeOffers} color="bg-blue-500/10 text-blue-400" />
      </div>
      <div className="bg-card border border-border rounded-sm p-6">
        <h2 className="text-sm tracking-widest uppercase text-muted-foreground mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/admin/products', label: 'Manage Products' },
            { href: '/admin/products?new=1', label: 'Add New Product' },
            { href: '/admin/offers', label: 'Manage Offers' },
            { href: '/admin/orders', label: 'View Orders' },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="border border-border rounded-sm px-4 py-3 text-sm text-muted-foreground hover:border-[hsl(43_76%_52%/0.5)] hover:text-[hsl(43_76%_52%)] transition-all text-center"
            >{label}</a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
