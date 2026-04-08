import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, ShoppingBag, Settings, LogOut, Menu, X, ExternalLink
} from 'lucide-react';
import { getToken, adminApi, setToken } from '@/lib/adminApi';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/offers', icon: Tag, label: 'Offers' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!getToken()) { navigate('/admin/login'); return; }
    adminApi.me().then(d => setUsername(d.username)).catch(() => {
      setToken(null);
      navigate('/admin/login');
    });
  }, []);

  const logout = () => { setToken(null); navigate('/admin/login'); };

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-[#0d0d0d] border-r border-border">
      <div className="p-6 border-b border-border">
        <p className="text-[hsl(43_76%_52%)] font-display text-lg tracking-[0.3em]">ARJWAN</p>
        <p className="text-muted-foreground/50 text-[10px] tracking-widest mt-0.5">ADMIN PANEL</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link key={to} to={to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-all ${
                active
                  ? 'bg-[hsl(43_76%_52%/0.15)] text-[hsl(43_76%_52%)] border border-[hsl(43_76%_52%/0.3)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted"
        >
          <ExternalLink size={14} /> View Website
        </a>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground hover:text-red-400 transition-colors rounded-sm hover:bg-muted"
        >
          <LogOut size={14} /> Sign Out {username && `(${username})`}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] flex">
      <aside className="hidden lg:flex lg:w-56 shrink-0 flex-col fixed top-0 bottom-0 left-0 z-30">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed top-0 bottom-0 left-0 w-56 z-50 lg:hidden">
            <Sidebar />
          </aside>
        </>
      )}

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        <header className="bg-[#0d0d0d] border-b border-border px-4 md:px-6 h-14 flex items-center justify-between lg:justify-end">
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <p className="text-xs text-muted-foreground">
            Signed in as <span className="text-foreground">{username}</span>
          </p>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
