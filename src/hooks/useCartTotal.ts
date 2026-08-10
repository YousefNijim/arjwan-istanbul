import { useMemo } from 'react';
import { useOffers } from './useOffers';
import type { CartItem } from '@/store/cartStore';

export const useCartTotal = (items: CartItem[]) => {
  const { data: offers = [] } = useOffers();

  return useMemo(() => {
    let subtotal = 0;
    const itemsFlat: CartItem[] = []; // Unroll quantities into individual items for accurate Nth item calculations

    items.forEach((item) => {
      subtotal += item.price * item.quantity;
      for (let i = 0; i < item.quantity; i++) {
        itemsFlat.push({ ...item, quantity: 1 });
      }
    });

    let discountAmount = 0;

    // Sort items by price (ascending) so that discounts apply to the cheapest items first
    itemsFlat.sort((a, b) => a.price - b.price);

    // Apply Cart Quantity Rules ("Buy X items in cart, get discount on the Xth item")
    // Note: We only apply one quantity rule (the one with the best discount)
    const quantityRules = offers.filter((o) => o.active && o.type === 'buy_x');
    
    if (quantityRules.length > 0) {
      // Find the rule that gives the maximum absolute discount
      let bestRuleDiscount = 0;

      for (const rule of quantityRules) {
        const x = parseInt(rule.targetValue || '0', 10);
        if (isNaN(x) || x <= 0) continue;

        let ruleDiscount = 0;
        let applicableItemsCount = Math.floor(itemsFlat.length / x);

        for (let i = 0; i < applicableItemsCount; i++) {
          // Apply to the cheapest items
          const item = itemsFlat[i];
          ruleDiscount += (item.price * rule.discountPercent) / 100;
        }

        if (ruleDiscount > bestRuleDiscount) {
          bestRuleDiscount = ruleDiscount;
        }
      }

      discountAmount += bestRuleDiscount;
    }

    // Apply "All Cart" rules if they exist (type = 'cart_total') - if user creates it in the future
    const cartTotalRules = offers.filter((o) => o.active && o.type === 'cart_total');
    let maxCartPercent = 0;
    for (const rule of cartTotalRules) {
      if (rule.discountPercent > maxCartPercent) {
        maxCartPercent = rule.discountPercent;
      }
    }
    
    if (maxCartPercent > 0) {
      discountAmount += (subtotal * maxCartPercent) / 100;
    }

    // Round discount to nearest integer
    discountAmount = Math.round(discountAmount);
    
    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    const total = subtotal - discountAmount;

    return {
      subtotal,
      discountAmount,
      total,
    };
  }, [items, offers]);
};
