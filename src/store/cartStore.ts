import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  size: '50ml' | '100ml';
  concentration: 'heavy' | 'light';
  quantity: number;
  price: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, concentration: string) => void;
  updateQuantity: (productId: string, size: string, concentration: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
    const existing = state.items.find(
      (i) => i.productId === item.productId && i.size === item.size && i.concentration === item.concentration
    );
    if (existing) {
      return {
        items: state.items.map((i) =>
          i.productId === item.productId && i.size === item.size && i.concentration === item.concentration
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      };
    }
    return { items: [...state.items, item] };
  }),
  removeItem: (productId, size, concentration) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.productId === productId && i.size === size && i.concentration === concentration)
      ),
    })),
  updateQuantity: (productId, size, concentration, quantity) =>
    set((state) => ({
      items: quantity <= 0
        ? state.items.filter(
            (i) => !(i.productId === productId && i.size === size && i.concentration === concentration)
          )
        : state.items.map((i) =>
            i.productId === productId && i.size === size && i.concentration === concentration
              ? { ...i, quantity }
              : i
          ),
    })),
  clearCart: () => set({ items: [] }),
  totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'arjwan-cart-storage', // unique name in localStorage
    }
  )
);
