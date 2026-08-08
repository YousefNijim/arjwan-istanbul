import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '@/lib/adminApi';
import { ArrowLeft, Upload } from 'lucide-react';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">{label}</label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors ${props.className || ''}`} />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} rows={2} className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors resize-none" />
);

const EMPTY: Record<string, any> = {
  id: '', nameAr: '', nameEn: '', nameTr: '',
  descriptionAr: '', descriptionEn: '', descriptionTr: '',
  category: 'men', price50ml: '', price100ml: '',
  imageUrl: '/bottle-black.png', additionalImages: [], inspiredBy: '', originalPerfume: '',
  notesTopAr: '', notesTopEn: '', notesTopTr: '',
  notesMiddleAr: '', notesMiddleEn: '', notesMiddleTr: '',
  notesBaseAr: '', notesBaseEn: '', notesBaseTr: '',
  usageAr: 'يُرش العطر على أماكن النبض: العنق، والصدر، والمعصمين. تجنب فركه بعد الرش للحفاظ على ثبات المكونات العطرية.', 
  usageEn: 'Apply to clean skin or clothing as often as desired. To increase longevity, it is recommended to spray on pulse points (inner wrists, neck).', 
  usageTr: 'Temiz tene veya kıyafete istenilen sıklıkta uygulanır. Kalıcılığı artırmak için nabız noktalarına (bilek içleri, boyun) sıkılması önerilir.',
  featured: false, active: true, sortOrder: 0,
};

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      adminApi.getPerfumes().then(list => {
        const p = list.find((x: any) => x.id === id);
        if (p) setForm({ ...EMPTY, ...p });
      });
    }
  }, [id]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      set('imageUrl', url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = { ...form, price50ml: Number(form.price50ml), price100ml: Number(form.price100ml), sortOrder: Number(form.sortOrder) };
      if (isEdit) await adminApi.updatePerfume(id!, data);
      else await adminApi.createPerfume(data);
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Products
      </button>
      <h1 className="font-display text-2xl text-foreground tracking-wider mb-6">{isEdit ? 'Edit Product' : 'New Product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-sm">{error}</p>}

        <div className="bg-card border border-border rounded-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-full text-xs tracking-widest uppercase text-muted-foreground mb-1">Basic Info</h2>
          {!isEdit && <Field label="ID (URL slug)"><Input value={form.id} onChange={e => set('id', e.target.value)} placeholder="e.g. bosphorus" required /></Field>}
          <Field label="Name (English)"><Input value={form.nameEn} onChange={e => set('nameEn', e.target.value)} required /></Field>
          <Field label="Name (Arabic)"><Input value={form.nameAr} onChange={e => set('nameAr', e.target.value)} dir="rtl" required /></Field>
          <Field label="Name (Turkish)"><Input value={form.nameTr} onChange={e => set('nameTr', e.target.value)} required /></Field>
          <Field label="Category">
            <select value={form.category} onChange={e => {
              const newCategory = e.target.value;
              setForm(f => {
                const isDefault = f.imageUrl === '' || f.imageUrl === '/bottle-black.png' || f.imageUrl === '/bottle-gold.png';
                return {
                  ...f,
                  category: newCategory,
                  imageUrl: isDefault ? (newCategory === 'men' ? '/bottle-black.png' : '/bottle-gold.png') : f.imageUrl
                };
              });
            }} className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors">
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </Field>
          <Field label="Inspired By (Brand)"><Input value={form.inspiredBy} onChange={e => set('inspiredBy', e.target.value)} placeholder="e.g. Chanel" /></Field>
          <Field label="Original Perfume Name"><Input value={form.originalPerfume} onChange={e => set('originalPerfume', e.target.value)} placeholder="e.g. BLEU DE CHANEL" /></Field>
          <Field label="Price 50ml (TL)"><Input type="number" value={form.price50ml} onChange={e => set('price50ml', e.target.value)} required /></Field>
          <Field label="Price 100ml (TL)"><Input type="number" value={form.price100ml} onChange={e => set('price100ml', e.target.value)} required /></Field>
          <Field label="Sort Order"><Input type="number" value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)} /></Field>
          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-[hsl(43_76%_52%)]" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-[hsl(43_76%_52%)]" />
              Active
            </label>
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Images</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Primary Image</p>
              <div className="flex items-center gap-4">
                <img src={form.imageUrl} alt="" className="w-20 h-24 object-cover bg-secondary rounded-sm border border-border" />
                <div className="space-y-2">
                  <Input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="Image URL (leave empty for default)" className="w-72" />
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    <Upload size={14} />
                    {uploadLoading ? 'Uploading…' : 'Upload primary image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Additional Images (Gallery)</p>
              <div className="flex flex-wrap gap-4 mb-3">
                {(form.additionalImages || []).map((img: string, idx: number) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt="" className="w-20 h-24 object-cover bg-secondary rounded-sm border border-border" />
                    <button 
                      type="button" 
                      onClick={() => set('additionalImages', form.additionalImages.filter((_: any, i: number) => i !== idx))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <label className="flex w-fit items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors border border-border px-3 py-2 rounded-sm bg-secondary">
                <Upload size={14} />
                {uploadLoading ? 'Uploading…' : 'Add Gallery Image'}
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadLoading(true);
                  try {
                    const { url } = await adminApi.uploadImage(file);
                    set('additionalImages', [...(form.additionalImages || []), url]);
                  } catch (err: any) {
                    setError(err.message);
                  } finally {
                    setUploadLoading(false);
                  }
                }} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Descriptions</h2>
          <Field label="Description (English)"><Textarea value={form.descriptionEn} onChange={e => set('descriptionEn', e.target.value)} /></Field>
          <Field label="Description (Arabic)"><Textarea value={form.descriptionAr} onChange={e => set('descriptionAr', e.target.value)} dir="rtl" /></Field>
          <Field label="Description (Turkish)"><Textarea value={form.descriptionTr} onChange={e => set('descriptionTr', e.target.value)} /></Field>
        </div>

        <div className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">Fragrance Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground/70">Top Notes</p>
              <Field label="English"><Input value={form.notesTopEn} onChange={e => set('notesTopEn', e.target.value)} /></Field>
              <Field label="Arabic"><Input value={form.notesTopAr} onChange={e => set('notesTopAr', e.target.value)} dir="rtl" /></Field>
              <Field label="Turkish"><Input value={form.notesTopTr} onChange={e => set('notesTopTr', e.target.value)} /></Field>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground/70">Middle Notes</p>
              <Field label="English"><Input value={form.notesMiddleEn} onChange={e => set('notesMiddleEn', e.target.value)} /></Field>
              <Field label="Arabic"><Input value={form.notesMiddleAr} onChange={e => set('notesMiddleAr', e.target.value)} dir="rtl" /></Field>
              <Field label="Turkish"><Input value={form.notesMiddleTr} onChange={e => set('notesMiddleTr', e.target.value)} /></Field>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground/70">Base Notes</p>
              <Field label="English"><Input value={form.notesBaseEn} onChange={e => set('notesBaseEn', e.target.value)} /></Field>
              <Field label="Arabic"><Input value={form.notesBaseAr} onChange={e => set('notesBaseAr', e.target.value)} dir="rtl" /></Field>
              <Field label="Turkish"><Input value={form.notesBaseTr} onChange={e => set('notesBaseTr', e.target.value)} /></Field>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground">How to Use</h2>
          <Field label="Usage (English)"><Textarea value={form.usageEn} onChange={e => set('usageEn', e.target.value)} /></Field>
          <Field label="Usage (Arabic)"><Textarea value={form.usageAr} onChange={e => set('usageAr', e.target.value)} dir="rtl" /></Field>
          <Field label="Usage (Turkish)"><Textarea value={form.usageTr} onChange={e => set('usageTr', e.target.value)} /></Field>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="bg-[hsl(43_76%_52%)] text-black px-8 py-2.5 text-sm tracking-widest uppercase font-medium hover:bg-[hsl(43_76%_60%)] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')}
            className="border border-border px-8 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
