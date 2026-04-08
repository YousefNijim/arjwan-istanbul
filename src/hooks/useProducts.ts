import { useQuery } from '@tanstack/react-query';
import { transformPerfume } from '@/lib/transformProduct';
import type { Product } from '@/data/products';

const fetchPerfumes = async (): Promise<Product[]> => {
  const res = await fetch('/api/perfumes');
  if (!res.ok) throw new Error('Failed to fetch perfumes');
  const data = await res.json();
  return data.map(transformPerfume);
};

const fetchPerfume = async (id: string): Promise<Product> => {
  const res = await fetch(`/api/perfumes/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return transformPerfume(await res.json());
};

export const useProducts = () =>
  useQuery<Product[]>({ queryKey: ['/api/perfumes'], queryFn: fetchPerfumes, staleTime: 60_000 });

export const useProduct = (id: string) =>
  useQuery<Product>({ queryKey: ['/api/perfumes', id], queryFn: () => fetchPerfume(id), enabled: !!id, staleTime: 60_000 });
