import type { Product } from '@/data/products';

export const transformPerfume = (p: any): Product => ({
  id: p.id,
  name: { ar: p.nameAr, en: p.nameEn, tr: p.nameTr },
  description: { ar: p.descriptionAr, en: p.descriptionEn, tr: p.descriptionTr },
  category: p.category as 'men' | 'women',
  price50ml: p.price50ml,
  price100ml: p.price100ml,
  image: (!p.imageUrl || p.imageUrl.startsWith('/bottle-'))
    ? (p.category === 'men' 
        ? 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/man%20perfume%20car%20pic.png' 
        : 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/women%20perfume%20card%20pic.png')
    : p.imageUrl,
  inspiredBy: p.inspiredBy,
  originalPerfume: p.originalPerfume,
  notes: {
    top: { ar: p.notesTopAr, en: p.notesTopEn, tr: p.notesTopTr },
    middle: { ar: p.notesMiddleAr, en: p.notesMiddleEn, tr: p.notesMiddleTr },
    base: { ar: p.notesBaseAr, en: p.notesBaseEn, tr: p.notesBaseTr },
  },
  featured: p.featured ?? false,
});
