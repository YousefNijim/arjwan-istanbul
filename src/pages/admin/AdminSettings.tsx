import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Save, X } from 'lucide-react';

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

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({
    logoText: 'ARJWAN', logoSubtext: 'Istanbul', whatsappNumber: '',
    instagramHandle: '', contactEmail: '', heroBackground: '',
    brandStoryBackground: '', customLogoUrl: '',
    homeBanners: [], perfumeBanners: [], bannerHeight: 400,
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
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Visual Backgrounds</h2>
          <Field label="Hero Section Background URL" hint="Image URL for the homepage hero section (leave empty for default dark bg)">
            <Input value={settings.heroBackground || ''} onChange={e => set('heroBackground', e.target.value)} placeholder="/uploads/hero-bg.jpg or https://..." />
          </Field>
          <Field label="Brand Story Section Background URL" hint="Image URL for the 'Our Story' section background">
            <Input value={settings.brandStoryBackground || ''} onChange={e => set('brandStoryBackground', e.target.value)} placeholder="/uploads/story-bg.jpg or https://..." />
          </Field>
        </section>

        <section className="bg-card border border-border rounded-sm p-6 space-y-6">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Offer Banners</h2>
          <Field label="Banner Height (px)" hint="Controls the display height of the slider on all pages (e.g. 400, 600, 800)">
            <Input
              type="number"
              min="100"
              max="1200"
              value={settings.bannerHeight ?? 400}
              onChange={e => set('bannerHeight', Number(e.target.value))}
              placeholder="400"
            />
          </Field>
          <Field label="Home Page Banners" hint="Displayed above the Featured Perfumes section on the home page">
            <div className="mt-2">
              <BannerArrayEditor
                banners={Array.isArray(settings.homeBanners) ? settings.homeBanners : []}
                onChange={urls => set('homeBanners', urls)}
              />
            </div>
          </Field>
          <Field label="Perfumes Page Banners" hint="Displayed at the top of the Perfumes page">
            <div className="mt-2">
              <BannerArrayEditor
                banners={Array.isArray(settings.perfumeBanners) ? settings.perfumeBanners : []}
                onChange={urls => set('perfumeBanners', urls)}
              />
            </div>
          </Field>
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
