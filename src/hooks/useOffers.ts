import { useQuery } from '@tanstack/react-query';

export interface Offer {
  id: number;
  type: string;
  targetValue: string | null;
  label: string;
  discountPercent: number;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
}

export const useOffers = () =>
  useQuery<Offer[]>({ queryKey: ['/api/offers'], queryFn: async () => {
    const res = await fetch('/api/offers');
    if (!res.ok) throw new Error('Failed to fetch offers');
    return res.json();
  }, staleTime: 60_000 });

export const getDiscountForProduct = (
  offers: Offer[],
  productId: string,
  category: string,
  brand: string,
): number => {
  let best = 0;
  for (const o of offers) {
    if (!o.active) continue;
    let applies = false;
    if (o.type === 'all') applies = true;
    else if (o.type === 'category' && o.targetValue === category) applies = true;
    else if (o.type === 'brand' && o.targetValue === brand) applies = true;
    else if (o.type === 'perfume' && o.targetValue === productId) applies = true;
    if (applies && o.discountPercent > best) best = o.discountPercent;
  }
  return best;
};
