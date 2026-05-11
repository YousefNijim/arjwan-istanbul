import { useQuery } from '@tanstack/react-query';

const fetchSettings = async (): Promise<Record<string, any>> => {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
};

export const useSettings = () =>
  useQuery<Record<string, any>>({
    queryKey: ['/api/settings'],
    queryFn: fetchSettings,
    staleTime: 300_000,
  });
