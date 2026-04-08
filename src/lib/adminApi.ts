const BASE = '/api';

let token: string | null = localStorage.getItem('admin_token');

export const setToken = (t: string | null) => {
  token = t;
  if (t) localStorage.setItem('admin_token', t);
  else localStorage.removeItem('admin_token');
};

export const getToken = () => token;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

async function req<T>(method: string, path: string, body?: any): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const adminApi = {
  login: (username: string, password: string) =>
    req<{ token: string; username: string }>('POST', '/admin/login', { username, password }),
  me: () => req<{ username: string }>('GET', '/admin/me'),

  getStats: () => req<any>('GET', '/admin/stats'),

  getPerfumes: () => req<any[]>('GET', '/admin/perfumes'),
  createPerfume: (data: any) => req<any>('POST', '/admin/perfumes', data),
  updatePerfume: (id: string, data: any) => req<any>('PUT', `/admin/perfumes/${id}`, data),
  deletePerfume: (id: string) => req<any>('DELETE', `/admin/perfumes/${id}`),

  getOffers: () => req<any[]>('GET', '/admin/offers'),
  createOffer: (data: any) => req<any>('POST', '/admin/offers', data),
  updateOffer: (id: number, data: any) => req<any>('PUT', `/admin/offers/${id}`, data),
  deleteOffer: (id: number) => req<any>('DELETE', `/admin/offers/${id}`),

  getOrders: () => req<any[]>('GET', '/admin/orders'),
  updateOrder: (id: number, data: any) => req<any>('PUT', `/admin/orders/${id}`, data),

  getSettings: () => req<Record<string, any>>('GET', '/settings'),
  updateSettings: (data: Record<string, any>) => req<any>('PUT', '/admin/settings', data),

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch(`${BASE}/admin/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};
