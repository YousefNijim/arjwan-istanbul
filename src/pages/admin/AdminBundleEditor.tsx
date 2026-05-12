import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '@/lib/adminApi';
import { Save, X, Plus, ArrowLeft } from 'lucide-react';

// ── Shared primitives ─────────────────────────────────────────────────────────
const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">{label}</label>
    {children}
    {hint && <p className="text-xs text-muted-foreground/50 mt-1">{hint}</p>}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors ${props.className || ''}`}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <select
    {...props}
    className={`w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors ${props.className || ''}`}
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    rows={3}
    {...props}
    className={`w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors resize-none ${props.className || ''}`}
  />
);

// ── Single image uploader ─────────────────────────────────────────────────────
const ImageUploader = ({ value, onChange }: { value: string; onChange: (url: string) => void }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      onChange(url);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-full h-36 bg-secondary border border-border overflow-hidden rounded-sm">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 end-2 bg-black/70 text-white rounded-full p-1 hover:bg-black/90 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <label className="cursor-pointer shrink-0">
          <span className="block text-xs bg-secondary border border-border px-3 py-2 hover:border-[hsl(43_76%_52%)] transition-colors text-muted-foreground whitespace-nowrap">
            {uploading ? 'Uploading…' : '↑ Upload'}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder="Or paste image URL…" />
      </div>
    </div>
  );
};

// ── Types ─────────────────────────────────────────────────────────────────────
type PerfumeCard = {
  id: string;
  image: string;
  name: string;
  description: string;
  size: string;
  badge: string;
  badgeColor: string;
};

type BundleSettings = {
  heroImage: string;
  heroSubtitle: string;
  heroTitle: string;
  badgeText: string;
  badgeColor: string;
  title: string;
  tagline: string;
  price: number | string;
  countdownDate: string;
  countdownLabel: string;
  cartName: string;
  cartSize: string;
  perfumes: PerfumeCard[];
};

const EMPTY: BundleSettings = {
  heroImage: '', heroSubtitle: '', heroTitle: '',
  badgeText: '', badgeColor: 'gold',
  title: '', tagline: '', price: 0,
  countdownDate: '2026-05-27', countdownLabel: 'Offer ends soon',
  cartName: '', cartSize: '',
  perfumes: [],
};

const newPerfume = (): PerfumeCard => ({
  id: `perf-${Date.now()}`,
  image: '', name: '', description: '', size: '', badge: '', badgeColor: 'gold',
});

// ── Page ──────────────────────────────────────────────────────────────────────
const AdminBundleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [s, setS] = useState<BundleSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getSettings().then(data => {
      const configs = data?.bundleConfigs || {};
      if (configs[id!]) setS(prev => ({ ...prev, ...configs[id!] }));
    }).finally(() => setLoading(false));
  }, [id]);

  const set = (k: keyof BundleSettings, v: any) => setS(prev => ({ ...prev, [k]: v }));

  const updatePerfume = (i: number, k: keyof PerfumeCard, v: any) =>
    setS(prev => ({ ...prev, perfumes: prev.perfumes.map((p, j) => j === i ? { ...p, [k]: v } : p) }));

  const removePerfume = (i: number) =>
    setS(prev => ({ ...prev, perfumes: prev.perfumes.filter((_, j) => j !== i) }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      const current = await adminApi.getSettings();
      const bundleConfigs = { ...(current.bundleConfigs || {}), [id!]: s };
      await adminApi.updateSettings({ ...current, bundleConfigs });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-muted-foreground py-12 text-center">Loading…</div>;

  return (
    <div>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/admin/bundles')}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft size={12} /> All Bundles
        </button>
        <h1 className="font-display text-2xl text-foreground tracking-wider">{s.title || id}</h1>
        <p className="text-muted-foreground/50 text-xs mt-1">
          Public page: /bundles/{id}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-sm">{error}</p>}
        {saved && <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 px-3 py-2 rounded-sm">Saved successfully.</p>}

        {/* Hero */}
        <section className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Hero Section</h2>
          <Field label="Hero Background Image">
            <ImageUploader value={s.heroImage} onChange={v => set('heroImage', v)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hero Subtitle" hint="Small text above the title">
              <Input value={s.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)} placeholder="His & Hers · Eid Collection" />
            </Field>
            <Field label="Hero Title">
              <Input value={s.heroTitle} onChange={e => set('heroTitle', e.target.value)} placeholder="Eid Couples Collection" />
            </Field>
          </div>
        </section>

        {/* Bundle info */}
        <section className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Bundle Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Bundle Title">
              <Input value={s.title} onChange={e => set('title', e.target.value)} placeholder="Eid Couples Collection" />
            </Field>
            <Field label="Price (₺)">
              <Input type="number" value={s.price} onChange={e => set('price', Number(e.target.value))} placeholder="999" />
            </Field>
          </div>
          <Field label="Tagline">
            <Input value={s.tagline} onChange={e => set('tagline', e.target.value)} placeholder="The Perfect Eid Gift — For Him & For Her" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Badge Text">
              <Input value={s.badgeText} onChange={e => set('badgeText', e.target.value)} placeholder="Limited Stock · Eid Offer" />
            </Field>
            <Field label="Badge Color">
              <Select value={s.badgeColor} onChange={e => set('badgeColor', e.target.value)}>
                <option value="gold">Gold</option>
                <option value="red">Red</option>
                <option value="purple">Purple</option>
              </Select>
            </Field>
          </div>
        </section>

        {/* Cart */}
        <section className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Cart Settings</h2>
          <Field label="Cart Item Name" hint="Name shown in the shopping cart">
            <Input value={s.cartName} onChange={e => set('cartName', e.target.value)} placeholder="Eid Couples Collection — Aseel + Hürra (100ml each)" />
          </Field>
          <Field label="Cart Item Size">
            <Input value={s.cartSize} onChange={e => set('cartSize', e.target.value)} placeholder="100ml" />
          </Field>
        </section>

        {/* Countdown */}
        <section className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Countdown Timer</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="End Date">
              <Input type="date" value={s.countdownDate} onChange={e => set('countdownDate', e.target.value)} />
            </Field>
            <Field label="Countdown Label">
              <Input value={s.countdownLabel} onChange={e => set('countdownLabel', e.target.value)} placeholder="Eid offer ends soon" />
            </Field>
          </div>
        </section>

        {/* Perfume cards */}
        <section className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Perfume Cards</h2>
          <p className="text-xs text-muted-foreground/50">Individual products shown inside this bundle page</p>

          <div className="space-y-4">
            {s.perfumes.map((perf, i) => (
              <div key={perf.id} className="bg-secondary border border-border rounded-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground tracking-wider">{perf.name || `Perfume ${i + 1}`}</span>
                  <button type="button" onClick={() => removePerfume(i)} className="text-red-400 hover:text-red-300 transition-colors">
                    <X size={14} />
                  </button>
                </div>

                <Field label="Image">
                  <ImageUploader value={perf.image} onChange={v => updatePerfume(i, 'image', v)} />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Name">
                    <Input value={perf.name} onChange={e => updatePerfume(i, 'name', e.target.value)} placeholder="Aseel | أصيل" />
                  </Field>
                  <Field label="Size">
                    <Input value={perf.size} onChange={e => updatePerfume(i, 'size', e.target.value)} placeholder="100ml" />
                  </Field>
                </div>

                <Field label="Description">
                  <Textarea value={perf.description} onChange={e => updatePerfume(i, 'description', e.target.value)} placeholder="Warm, woody, and boldly masculine…" />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Badge Text" hint="Leave empty to hide badge">
                    <Input value={perf.badge} onChange={e => updatePerfume(i, 'badge', e.target.value)} placeholder="For Him" />
                  </Field>
                  <Field label="Badge Color">
                    <Select value={perf.badgeColor} onChange={e => updatePerfume(i, 'badgeColor', e.target.value)}>
                      <option value="purple">Purple</option>
                      <option value="gold">Gold</option>
                      <option value="red">Red</option>
                    </Select>
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setS(prev => ({ ...prev, perfumes: [...prev.perfumes, newPerfume()] }))}
            className="flex items-center gap-2 text-xs bg-secondary border border-border px-4 py-2 text-muted-foreground hover:border-[hsl(43_76%_52%)] hover:text-foreground transition-colors"
          >
            <Plus size={12} /> Add Perfume Card
          </button>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[hsl(43_76%_52%)] text-black px-8 py-3 text-sm tracking-widest uppercase font-medium hover:bg-[hsl(43_76%_60%)] transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving…' : 'Save Bundle'}
        </button>
      </form>
    </div>
  );
};

export default AdminBundleEditor;
