import type { Product } from '@/data/products';

export const transformPerfume = (p: any): Product => ({
  id: p.id,
  name: { ar: p.nameAr, en: p.nameEn, tr: p.nameTr },
  description: { ar: p.descriptionAr, en: p.descriptionEn, tr: p.descriptionTr },
  category: p.category as 'men' | 'women',
  price50ml: p.price50ml,
  price100ml: p.price100ml,
  image: p.imageUrl || (p.category === 'men' 
    ? 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/man%20perfume%20car%20pic.png' 
    : 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/women%20perfume%20card%20pic.png'),
  additionalImages: Array.isArray(p.additionalImages) ? p.additionalImages : [],
  inspiredBy: p.inspiredBy,
  originalPerfume: p.originalPerfume,
  notes: {
    top: { ar: p.notesTopAr, en: p.notesTopEn, tr: p.notesTopTr },
    middle: { ar: p.notesMiddleAr, en: p.notesMiddleEn, tr: p.notesMiddleTr },
    base: { ar: p.notesBaseAr, en: p.notesBaseEn, tr: p.notesBaseTr },
  },
  usage: {
    ar: p.usageAr || 'يُرش العطر على أماكن النبض: العنق، والصدر، والمعصمين. تجنب فركه بعد الرش للحفاظ على ثبات المكونات العطرية.',
    en: p.usageEn || 'Apply to clean skin or clothing as often as desired. To increase longevity, it is recommended to spray on pulse points (inner wrists, neck).',
    tr: p.usageTr || 'Temiz tene veya kıyafete istenilen sıklıkta uygulanır. Kalıcılığı artırmak için nabız noktalarına (bilek içleri, boyun) sıkılması önerilir.',
  },
  featured: p.featured ?? false,
  active: p.active ?? true,
});
