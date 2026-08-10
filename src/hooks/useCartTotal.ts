import { useMemo } from 'react';
import { useOffers } from './useOffers';
import type { CartItem } from '@/store/cartStore';

export interface AppliedDiscount {
  label: string;
  amount: number;
}

export interface CartItemWithDiscounts extends CartItem {
  cartDiscounts: AppliedDiscount[];
  rowTotal: number;
}

export const useCartTotal = (items: CartItem[]) => {
  const { data: offers = [] } = useOffers();

  return useMemo(() => {
    let subtotal = 0;
    
    // Flat item representation
    interface FlatItem extends CartItem {
      originalIndex: number;
      appliedRule: AppliedDiscount | null;
    }
    
    const itemsFlat: FlatItem[] = [];

    items.forEach((item, index) => {
      subtotal += item.price * item.quantity;
      for (let i = 0; i < item.quantity; i++) {
        itemsFlat.push({ ...item, quantity: 1, originalIndex: index, appliedRule: null });
      }
    });

    let discountAmount = 0;

    // Sort items by price DESCENDING (most expensive is 1st item)
    itemsFlat.sort((a, b) => b.price - a.price);

    const quantityRules = offers.filter((o) => o.active && o.type === 'buy_x');
    
    // Apply sequential rules
    itemsFlat.forEach((item, index) => {
      const pos = index + 1; // 1-based position
      
      let bestDiscount = 0;
      let bestLabel = '';

      for (const rule of quantityRules) {
        const x = parseInt(rule.targetValue || '0', 10);
        if (isNaN(x) || x <= 0) continue;

        // If this position triggers the rule (e.g. every 2nd item -> pos % 2 === 0)
        if (pos % x === 0) {
          const ruleDiscount = (item.price * rule.discountPercent) / 100;
          if (ruleDiscount > bestDiscount) {
            bestDiscount = ruleDiscount;
            bestLabel = rule.label;
          }
        }
      }

      if (bestDiscount > 0) {
        bestDiscount = Math.round(bestDiscount);
        item.appliedRule = { label: bestLabel, amount: bestDiscount };
        discountAmount += bestDiscount;
      }
    });

    // Re-group flat items back to their original cart rows
    const itemsWithDiscounts: CartItemWithDiscounts[] = items.map(item => ({
      ...item,
      cartDiscounts: [],
      rowTotal: item.price * item.quantity
    }));

    itemsFlat.forEach(flat => {
      if (flat.appliedRule) {
        itemsWithDiscounts[flat.originalIndex].cartDiscounts.push(flat.appliedRule);
        itemsWithDiscounts[flat.originalIndex].rowTotal -= flat.appliedRule.amount;
      }
    });

    // Apply "All Cart" rules if they exist (type = 'cart_total')
    const cartTotalRules = offers.filter((o) => o.active && o.type === 'cart_total');
    let maxCartPercent = 0;
    for (const rule of cartTotalRules) {
      if (rule.discountPercent > maxCartPercent) {
        maxCartPercent = rule.discountPercent;
      }
    }
    
    if (maxCartPercent > 0) {
      const cartDiscount = Math.round((subtotal * maxCartPercent) / 100);
      discountAmount += cartDiscount;
    }

    discountAmount = Math.min(discountAmount, subtotal);
    const total = subtotal - discountAmount;

    return {
      subtotal,
      discountAmount,
      total,
      itemsWithDiscounts
    };
  }, [items, offers]);
};
