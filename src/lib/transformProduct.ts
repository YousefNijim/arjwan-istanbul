import type { Product } from '@/data/products';

export const transformPerfume = (p: any): Product => ({
  id: p.id,
  name: { ar: p.nameAr, en: p.nameEn, tr: p.nameTr },
  description: { ar: p.descriptionAr, en: p.descriptionEn, tr: p.descriptionTr },
  category: p.category as 'men' | 'women',
  price50ml: p.price50ml,
  price100ml: p.price100ml,
  image: p.imageUrl,
  inspiredBy: p.inspiredBy,
  originalPerfume: p.originalPerfume,
  notes: {
    top: { ar: p.notesTopAr, en: p.notesTopEn, tr: p.notesTopTr },
    middle: { ar: p.notesMiddleAr, en: p.notesMiddleEn, tr: p.notesMiddleTr },
    base: { ar: p.notesBaseAr, en: p.notesBaseEn, tr: p.notesBaseTr },
  },
  featured: p.featured ?? false,
});
