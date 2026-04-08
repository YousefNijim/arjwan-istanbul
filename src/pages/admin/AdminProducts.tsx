import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    adminApi.getPerfumes().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (p: any) => {
    await adminApi.updatePerfume(p.id, { ...p, active: !p.active });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await adminApi.deletePerfume(id);
    load();
  };

  const filtered = products.filter(p =>
    p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    p.inspiredBy?.toLowerCase().includes(search.toLowerCase()) ||
    p.originalPerfume?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-foreground tracking-wider">Products</h1>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center gap-2 bg-[hsl(43_76%_52%)] text-black px-4 py-2 text-sm tracking-wider font-medium hover:bg-[hsl(43_76%_60%)] transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, brand, or original perfume…"
          className="w-full md:w-80 bg-secondary border border-border px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors"
        />
      </div>

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-start px-4 py-3 text-xs text-muted-foreground tracking-widest uppercase font-normal">Product</th>
                <th className="text-start px-4 py-3 text-xs text-muted-foreground tracking-widest uppercase font-normal hidden md:table-cell">Inspired By</th>
                <th className="text-start px-4 py-3 text-xs text-muted-foreground tracking-widest uppercase font-normal hidden lg:table-cell">Category</th>
                <th className="text-start px-4 py-3 text-xs text-muted-foreground tracking-widest uppercase font-normal">50ml / 100ml</th>
                <th className="text-start px-4 py-3 text-xs text-muted-foreground tracking-widest uppercase font-normal">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No products found</td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${i % 2 === 0 ? '' : 'bg-secondary/10'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.nameEn} className="w-8 h-10 object-contain bg-white/5 rounded-sm" />
                      <div>
                        <p className="font-medium text-foreground">{p.nameEn}</p>
                        <p className="text-xs text-muted-foreground">{p.id}</p>
                      </div>
                      {p.featured && <Star size={12} className="text-[hsl(43_76%_52%)] shrink-0" fill="currentColor" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-muted-foreground">{p.inspiredBy}</p>
                    <p className="text-xs text-[hsl(270_52%_65%)]">{p.originalPerfume}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${p.category === 'men' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : 'border-pink-500/30 text-pink-400 bg-pink-500/10'}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.price50ml} / {p.price100ml} TL
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${p.active ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-border text-muted-foreground bg-secondary'}`}>
                      {p.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => toggleActive(p)} title={p.active ? 'Hide' : 'Show'} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                        {p.active ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button onClick={() => navigate(`/admin/products/${p.id}/edit`)} className="p-1.5 text-muted-foreground hover:text-[hsl(43_76%_52%)] transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
