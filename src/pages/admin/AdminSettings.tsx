import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Save, X } from 'lucide-react';

// ── Single image uploader ─────────────────────────────────────────────────────
const SingleImageUploader = ({ value, onChange }: { value: string; onChange: (url: string) => void }) => {
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      onChange(url);
    } finally { setUploading(false); e.target.value = ''; }
  };
  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-full h-32 bg-secondary border border-border overflow-hidden rounded-sm">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange('')} className="absolute top-2 end-2 bg-black/70 text-white rounded-full p-1 hover:bg-black/90 transition-colors"><X size={12} /></button>
        </div>
      )}
      <div className="flex gap-2">
        <label className="cursor-pointer shrink-0">
          <span className="block text-xs bg-secondary border border-border px-3 py-2 hover:border-[hsl(43_76%_52%)] transition-colors text-muted-foreground whitespace-nowrap">
            {uploading ? 'Uploading…' : '↑ Upload'}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder="Or paste image URL…" className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors" />
      </div>
    </div>
  );
};

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">{label}</label>
    {children}
    {hint && <p className="text-xs text-muted-foreground/50 mt-1">{hint}</p>}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors ${props.className || ''}`} />
);

// ── Banner array editor ───────────────────────────────────────────────────────
const BannerArrayEditor = ({
  banners,
  onChange,
}: {
  banners: string[];
  onChange: (urls: string[]) => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      onChange([...banners, url]);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    onChange([...banners, url]);
    setUrlInput('');
  };

  return (
    <div className="space-y-3">
      {banners.map((url, i) => (
        <div key={i} className="flex items-center gap-3 bg-secondary border border-border p-2">
          <img src={url} alt="" className="w-16 h-10 object-cover rounded-sm shrink-0" />
          <span className="text-xs text-muted-foreground truncate flex-1">{url}</span>
          <button
            type="button"
            onClick={() => onChange(banners.filter((_, j) => j !== i))}
            className="text-red-400 hover:text-red-300 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <label className="flex items-center gap-2 cursor-pointer w-fit">
        <span className="text-xs bg-secondary border border-border px-3 py-2 hover:border-[hsl(43_76%_52%)] transition-colors text-muted-foreground">
          {uploading ? 'Uploading…' : '+ Upload Image'}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>
      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
          placeholder="Or paste image URL…"
        />
        <button
          type="button"
          onClick={addUrl}
          className="text-xs bg-secondary border border-border px-3 py-2 text-muted-foreground hover:border-[hsl(43_76%_52%)] hover:text-foreground transition-colors whitespace-nowrap"
        >
          Add URL
        </button>
      </div>
    </div>
  );
};

// ── Bundle offer editor ───────────────────────────────────────────────────────
type BundleItem = {
  id: string;
  path: string;
  image: string;
  name: string;
  badge: string;
  badgeStyle: 'red' | 'gold';
  desc: string;
  price: number | string;
  items: string;
};

const emptyBundle = (): BundleItem => ({
  id: `bundle-${Date.now()}`,
  path: '',
  image: '',
  name: '',
  badge: '',
  badgeStyle: 'gold',
  desc: '',
  price: '',
  items: '',
});

const BundleEditor = ({
  bundles,
  onChange,
}: {
  bundles: BundleItem[];
  onChange: (bundles: BundleItem[]) => void;
}) => {
  const [uploading, setUploading] = useState<number | null>(null);

  const update = (i: number, key: keyof BundleItem, value: any) =>
    onChange(bundles.map((b, j) => (j === i ? { ...b, [key]: value } : b)));

  const handleUpload = async (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(i);
    try {
      const { url } = await adminApi.uploadImage(file);
      update(i, 'image', url);
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {bundles.map((bundle, i) => (
        <div key={bundle.id} className="bg-secondary border border-border rounded-sm p-4 space-y-3">
          {/* Header row */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-foreground tracking-wider">
              {bundle.name || `Bundle ${i + 1}`}
            </span>
            <button
              type="button"
              onClick={() => onChange(bundles.filter((_, j) => j !== i))}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Image */}
          <div className="flex items-start gap-3">
            <div className="w-20 h-24 bg-background border border-border overflow-hidden shrink-0 flex items-center justify-center">
              {bundle.image
                ? <img src={bundle.image} alt="" className="w-full h-full object-cover" />
                : <span className="text-muted-foreground/30 text-[10px]">No image</span>
              }
            </div>
            <div className="flex-1 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <span className="text-xs bg-background border border-border px-3 py-1.5 hover:border-[hsl(43_76%_52%)] transition-colors text-muted-foreground">
                  {uploading === i ? 'Uploading…' : '↑ Upload Image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleUpload(i, e)}
                  disabled={uploading !== null}
                />
              </label>
              <Input
                value={bundle.image}
                onChange={e => update(i, 'image', e.target.value)}
                placeholder="Or paste image URL…"
              />
            </div>
          </div>

          {/* Name + Price */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Bundle Name">
              <Input
                value={bundle.name}
                onChange={e => update(i, 'name', e.target.value)}
                placeholder="Eid Couples Collection"
              />
            </Field>
            <Field label="Price (₺)">
              <Input
                type="number"
                value={bundle.price}
                onChange={e => update(i, 'price', Number(e.target.value))}
                placeholder="999"
              />
            </Field>
          </div>

          {/* Badge */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Badge Text">
              <Input
                value={bundle.badge}
                onChange={e => update(i, 'badge', e.target.value)}
                placeholder="His & Hers"
              />
            </Field>
            <Field label="Badge Color">
              <select
                value={bundle.badgeStyle}
                onChange={e => update(i, 'badgeStyle', e.target.value as 'red' | 'gold')}
                className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors"
              >
                <option value="gold">Gold</option>
                <option value="red">Red</option>
              </select>
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <Input
              value={bundle.desc}
              onChange={e => update(i, 'desc', e.target.value)}
              placeholder="Aseel + Hürra — 100ml each. The perfect Eid gift."
            />
          </Field>

          {/* Items label + path */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Items Label" hint="e.g. 2 Bottles · 100ml each">
              <Input
                value={bundle.items}
                onChange={e => update(i, 'items', e.target.value)}
                placeholder="2 Bottles · 100ml each"
              />
            </Field>
            <Field label="Detail Page Path" hint="e.g. /bundles/couples-eid">
              <Input
                value={bundle.path}
                onChange={e => update(i, 'path', e.target.value)}
                placeholder="/bundles/couples-eid"
              />
            </Field>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...bundles, emptyBundle()])}
        className="text-xs bg-secondary border border-border px-4 py-2 text-muted-foreground hover:border-[hsl(43_76%_52%)] hover:text-foreground transition-colors"
      >
        + Add Bundle
      </button>
    </div>
  );
};

// ── Main settings page ────────────────────────────────────────────────────────
const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({
    logoText: 'ARJWAN', logoSubtext: 'Istanbul', whatsappNumber: '',
    instagramHandle: '', contactEmail: '', heroBackground: '',
    heroTitleAr: '', heroTitleEn: '', heroTitleTr: '',
    heroSubtitleAr: '', heroSubtitleEn: '', heroSubtitleTr: '',
    customLogoUrl: '',
    homeBanners: [], homeBannersMobile: [],
    perfumeBanners: [], perfumeBannersMobile: [],
    bannerHeight: 400, bannerHeightMobile: 220,
    bundles: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getSettings().then(s => {
      setSettings(prev => ({ ...prev, ...s }));
    }).finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: any) => setSettings(s => ({ ...s, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      await adminApi.updateSettings(settings);
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
      <h1 className="font-display text-2xl text-foreground tracking-wider mb-6">Site Settings</h1>
      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-sm">{error}</p>}
        {saved && <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 px-3 py-2 rounded-sm">Settings saved successfully.</p>}

        <section className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Brand Identity</h2>
          <Field label="Logo Text" hint="Main brand name displayed in the header">
            <Input value={settings.logoText || ''} onChange={e => set('logoText', e.target.value)} placeholder="ARJWAN" />
          </Field>
          <Field label="Logo Subtext" hint="City name shown below the main logo">
            <Input value={settings.logoSubtext || ''} onChange={e => set('logoSubtext', e.target.value)} placeholder="Istanbul" />
          </Field>
          <Field label="Custom Logo Image URL" hint="Optional: upload a logo image instead of text (leave empty for text logo)">
            <Input value={settings.customLogoUrl || ''} onChange={e => set('customLogoUrl', e.target.value)} placeholder="/uploads/logo.png or https://..." />
          </Field>
        </section>

        <section className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Contact & Social</h2>
          <Field label="WhatsApp Number" hint="Include country code without + (e.g. 905551234567)">
            <Input type="tel" value={settings.whatsappNumber || ''} onChange={e => set('whatsappNumber', e.target.value)} placeholder="905551234567" />
          </Field>
          <Field label="Instagram Handle" hint="Without the @ symbol">
            <Input value={settings.instagramHandle || ''} onChange={e => set('instagramHandle', e.target.value)} placeholder="arjwanistanbul" />
          </Field>
          <Field label="Contact Email">
            <Input type="email" value={settings.contactEmail || ''} onChange={e => set('contactEmail', e.target.value)} placeholder="info@arjwanistanbul.com" />
          </Field>
        </section>

        <section className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Homepage Promotion Text</h2>
          <div className="space-y-2 pt-2">
            <h3 className="text-xs tracking-widest uppercase text-muted-foreground">Promotion Section Title</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input value={settings.heroTitleAr || ''} onChange={e => set('heroTitleAr', e.target.value)} placeholder="العنوان العربي" dir="rtl" />
              <Input value={settings.heroTitleEn || ''} onChange={e => set('heroTitleEn', e.target.value)} placeholder="English Title" />
              <Input value={settings.heroTitleTr || ''} onChange={e => set('heroTitleTr', e.target.value)} placeholder="Türkçe Başlık" />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-xs tracking-widest uppercase text-muted-foreground">Promotion Section Subtitle</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input value={settings.heroSubtitleAr || ''} onChange={e => set('heroSubtitleAr', e.target.value)} placeholder="النص الفرعي" dir="rtl" />
              <Input value={settings.heroSubtitleEn || ''} onChange={e => set('heroSubtitleEn', e.target.value)} placeholder="English Subtitle" />
              <Input value={settings.heroSubtitleTr || ''} onChange={e => set('heroSubtitleTr', e.target.value)} placeholder="Türkçe Alt Başlık" />
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-sm p-6 space-y-6">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Offer Banners</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Banner Height — Desktop (px)" hint="e.g. 400, 600, 800">
              <Input
                type="number"
                min="100"
                max="1200"
                value={settings.bannerHeight ?? 400}
                onChange={e => set('bannerHeight', Number(e.target.value))}
                placeholder="400"
              />
            </Field>
            <Field label="Banner Height — Mobile (px)" hint="e.g. 180, 220, 300">
              <Input
                type="number"
                min="80"
                max="800"
                value={settings.bannerHeightMobile ?? 220}
                onChange={e => set('bannerHeightMobile', Number(e.target.value))}
                placeholder="220"
              />
            </Field>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground/70 tracking-widest uppercase border-b border-border pb-2">Top Sliders (Hero)</p>
            <Field label="Desktop Banners" hint="Shown at the very top of the homepage (Desktop)">
              <div className="mt-2">
                <BannerArrayEditor
                  banners={Array.isArray(settings.homeBanners) ? settings.homeBanners : []}
                  onChange={urls => set('homeBanners', urls)}
                />
              </div>
            </Field>
            <Field label="Mobile Banners" hint="Shown at the very top of the homepage (Mobile) — leave empty to fall back to desktop banners">
              <div className="mt-2">
                <BannerArrayEditor
                  banners={Array.isArray(settings.homeBannersMobile) ? settings.homeBannersMobile : []}
                  onChange={urls => set('homeBannersMobile', urls)}
                />
              </div>
            </Field>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground/70 tracking-widest uppercase border-b border-border pb-2">Mid-page Sliders</p>
            <Field label="Desktop Banners" hint="Shown in the middle of the homepage between products">
              <div className="mt-2">
                <BannerArrayEditor
                  banners={Array.isArray(settings.perfumeBanners) ? settings.perfumeBanners : []}
                  onChange={urls => set('perfumeBanners', urls)}
                />
              </div>
            </Field>
            <Field label="Mobile Banners" hint="Shown in the middle of the homepage (Mobile) — leave empty to fall back to desktop">
              <div className="mt-2">
                <BannerArrayEditor
                  banners={Array.isArray(settings.perfumeBannersMobile) ? settings.perfumeBannersMobile : []}
                  onChange={urls => set('perfumeBannersMobile', urls)}
                />
              </div>
            </Field>
          </div>
        </section>

        <section className="bg-card border border-border rounded-sm p-6 space-y-4">
          <div>
            <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Bundle Offers</h2>
            <p className="text-xs text-muted-foreground/50 mt-1">Manage the offer cards shown on the /offers page</p>
          </div>
          <BundleEditor
            bundles={Array.isArray(settings.bundles) ? settings.bundles : []}
            onChange={bundles => set('bundles', bundles)}
          />
        </section>

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-[hsl(43_76%_52%)] text-black px-8 py-3 text-sm tracking-widest uppercase font-medium hover:bg-[hsl(43_76%_60%)] transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
