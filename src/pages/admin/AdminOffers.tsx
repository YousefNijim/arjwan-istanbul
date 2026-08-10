import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

const EMPTY_OFFER = {
  type: 'all', targetValue: '', label: '', discountPercent: 10,
  startDate: '', endDate: '', active: true,
};

const typeLabels: Record<string, string> = {
  all: 'All Products', category: 'Category', brand: 'Brand', perfume: 'Specific Product',
  buy_x: 'Cart Quantity (Buy X get Y)',
};

const AdminOffers = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [perfumes, setPerfumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_OFFER });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.getOffers(), adminApi.getPerfumes()])
      .then(([o, p]) => { setOffers(o); setPerfumes(p); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const openNew = () => { setForm({ ...EMPTY_OFFER }); setEditId(null); setError(''); setShowForm(true); };
  const openEdit = (o: any) => {
    setForm({
      type: o.type, targetValue: o.targetValue || '',
      label: o.label, discountPercent: o.discountPercent,
      startDate: o.startDate ? new Date(o.startDate).toISOString().slice(0, 10) : '',
      endDate: o.endDate ? new Date(o.endDate).toISOString().slice(0, 10) : '',
      active: o.active,
    });
    setEditId(o.id); setError(''); setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editId) await adminApi.updateOffer(editId, form);
      else await adminApi.createOffer(form);
      setShowForm(false); load();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this offer?')) return;
    await adminApi.deleteOffer(id); load();
  };

  const toggleActive = async (o: any) => {
    await adminApi.updateOffer(o.id, { ...o, active: !o.active }); load();
  };

  const brands = [...new Set(perfumes.map(p => p.inspiredBy).filter(Boolean))];
  const now = new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-foreground tracking-wider">Offers & Discounts</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-[hsl(43_76%_52%)] text-black px-4 py-2 text-sm tracking-wider font-medium hover:bg-[hsl(43_76%_60%)] transition-colors">
          <Plus size={16} /> Create Offer
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-card border border-border rounded-sm p-6 w-full max-w-md">
            <h2 className="font-display text-lg text-foreground mb-5">{editId ? 'Edit Offer' : 'New Offer'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              {error && <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2">{error}</p>}
              <div>
                <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">Offer Label</label>
                <input value={form.label} onChange={e => set('label', e.target.value)} required placeholder="e.g. Summer Sale" className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)]" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">Applies To</label>
                <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)]">
                  <option value="all">All Products</option>
                  <option value="category">Category (Men/Women)</option>
                  <option value="brand">Specific Brand</option>
                  <option value="perfume">Specific Product</option>
                  <option value="buy_x">Cart Quantity (e.g. 3rd item is discounted)</option>
                </select>
              </div>
              {form.type === 'buy_x' && (
                <div>
                  <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">Trigger Quantity (X)</label>
                  <input type="number" min={2} max={100} value={form.targetValue} onChange={e => set('targetValue', e.target.value)} required placeholder="e.g. 3 for 3rd item" className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)]" />
                  <p className="text-[10px] text-muted-foreground mt-1">If 3, every 3rd (cheapest) item gets the discount below.</p>
                </div>
              )}
              {form.type === 'category' && (
                <div>
                  <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">Category</label>
                  <select value={form.targetValue} onChange={e => set('targetValue', e.target.value)} className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)]">
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
              )}
              {form.type === 'brand' && (
                <div>
                  <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">Brand</label>
                  <select value={form.targetValue} onChange={e => set('targetValue', e.target.value)} className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)]">
                    <option value="">Select brand…</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              )}
              {form.type === 'perfume' && (
                <div>
                  <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">Product</label>
                  <select value={form.targetValue} onChange={e => set('targetValue', e.target.value)} className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)]">
                    <option value="">Select product…</option>
                    {perfumes.map(p => <option key={p.id} value={p.id}>{p.nameEn}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">Discount %</label>
                <input type="number" min={1} max={99} value={form.discountPercent} onChange={e => set('discountPercent', e.target.value)} required className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)] [color-scheme:dark]" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)] [color-scheme:dark]" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-[hsl(43_76%_52%)]" />
                Active now
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[hsl(43_76%_52%)] text-black py-2 text-sm font-medium tracking-wider hover:bg-[hsl(43_76%_60%)] transition-colors disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-border py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-start px-4 py-3 text-xs text-muted-foreground tracking-widest uppercase font-normal">Label</th>
                <th className="text-start px-4 py-3 text-xs text-muted-foreground tracking-widest uppercase font-normal">Applies To</th>
                <th className="text-start px-4 py-3 text-xs text-muted-foreground tracking-widest uppercase font-normal">Discount</th>
                <th className="text-start px-4 py-3 text-xs text-muted-foreground tracking-widest uppercase font-normal hidden md:table-cell">Dates</th>
                <th className="text-start px-4 py-3 text-xs text-muted-foreground tracking-widest uppercase font-normal">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Loading…</td></tr>
              ) : offers.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No offers yet</td></tr>
              ) : offers.map((o, i) => {
                const expired = o.endDate && new Date(o.endDate) < now;
                const notStarted = o.startDate && new Date(o.startDate) > now;
                const status = !o.active ? 'inactive' : expired ? 'expired' : notStarted ? 'scheduled' : 'live';
                return (
                  <tr key={o.id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${i % 2 ? 'bg-secondary/10' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-[hsl(43_76%_52%)] shrink-0" />
                        <span className="font-medium text-foreground">{o.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span>{typeLabels[o.type] || o.type}</span>
                      {o.targetValue && <span className="text-xs ml-1 text-[hsl(270_52%_65%)]">({o.targetValue})</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[hsl(43_76%_52%)] font-medium">{o.discountPercent}% off</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {o.startDate ? new Date(o.startDate).toLocaleDateString() : '—'} → {o.endDate ? new Date(o.endDate).toLocaleDateString() : '∞'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        status === 'live' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                        status === 'scheduled' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                        status === 'expired' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                        'border-border text-muted-foreground'
                      }`}>{status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => toggleActive(o)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs">
                          {o.active ? 'Pause' : 'Enable'}
                        </button>
                        <button onClick={() => openEdit(o)} className="p-1.5 text-muted-foreground hover:text-[hsl(43_76%_52%)] transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(o.id)} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOffers;
