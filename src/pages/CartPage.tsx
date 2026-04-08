import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const CartPage = () => {
  const { t, lang } = useTranslation();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [customerName, setCustomerName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: settings } = useQuery<Record<string, any>>({
    queryKey: ['/api/settings'],
    queryFn: async () => { const r = await fetch('/api/settings'); return r.json(); },
    staleTime: 300_000,
  });
  const whatsappNumber = settings?.whatsappNumber || '905000000000';

  const handleCheckout = async () => {
    if (!customerName.trim()) return;
    setSubmitting(true);

    const total = totalPrice();
    const orderItems = items.map(item => ({
      productId: item.productId,
      name: item.name,
      size: item.size,
      concentration: item.concentration,
      quantity: item.quantity,
      price: item.price,
    }));

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          whatsappPhone: whatsappPhone.replace(/\D/g, ''),
          items: orderItems,
          subtotal: total,
          discountAmount: 0,
          total,
        }),
      });
    } catch {}

    const lines = items.map((item) => {
      const concLabel = t('products', item.concentration);
      return `• ${item.name} - ${item.size} - ${concLabel} x${item.quantity} = ${item.price * item.quantity} TL`;
    });

    const message = [
      `🛍️ Arjwan Istanbul Order`,
      `👤 ${customerName}`,
      whatsappPhone ? `📱 ${whatsappPhone}` : '',
      ``,
      ...lines,
      ``,
      `💰 Total: ${total} TL`,
    ].filter(Boolean).join('\n');

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
    clearCart();
    setSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex flex-col items-center justify-center">
        <ShoppingBag size={48} className="text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl text-primary tracking-wider mb-3">{t('cart', 'empty')}</h1>
        <Link
          to="/perfumes"
          className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wider"
        >
          {t('cart', 'continueShopping')} →
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl text-center text-primary tracking-wider mb-10"
        >
          {t('cart', 'title')}
        </motion.h1>

        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={`${item.productId}-${item.size}-${item.concentration}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="gold-border-glow rounded-sm bg-card p-4 flex items-center gap-4"
            >
              <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-sm" width={64} height={80} />
              <div className="flex-1 min-w-0">
                <h3 className="text-primary font-display tracking-wider">{item.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.size} · {t('products', item.concentration)}
                </p>
                <p className="text-sm text-primary mt-1">{item.price} TL</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.productId, item.size, item.concentration, item.quantity - 1)} className="w-7 h-7 border border-border flex items-center justify-center hover:border-primary transition-colors">
                  <Minus size={12} />
                </button>
                <span className="text-sm w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.size, item.concentration, item.quantity + 1)} className="w-7 h-7 border border-border flex items-center justify-center hover:border-primary transition-colors">
                  <Plus size={12} />
                </button>
              </div>

              <p className="text-primary font-display text-lg w-20 text-end">{item.price * item.quantity} TL</p>

              <button onClick={() => removeItem(item.productId, item.size, item.concentration)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Total + checkout */}
        <div className="mt-8 gold-border-glow rounded-sm bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg text-muted-foreground">{t('cart', 'total')}</span>
            <span className="text-2xl text-primary font-display">{totalPrice()} TL</span>
          </div>

          <div className="mb-3">
            <label className="text-sm text-muted-foreground block mb-2">{t('cart', 'name')}</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t('cart', 'enterName')}
              className="w-full bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-muted-foreground block mb-2">
              {lang === 'ar' ? 'رقم الواتساب (اختياري)' : lang === 'tr' ? 'WhatsApp Numaranız (isteğe bağlı)' : 'Your WhatsApp (optional)'}
            </label>
            <input
              type="tel"
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              placeholder="+905551234567"
              className="w-full bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={!customerName.trim() || submitting}
            className="w-full bg-[#25D366] text-primary-foreground py-4 text-sm tracking-widest uppercase hover:bg-[#25D366]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle size={18} />
            {submitting ? '…' : t('cart', 'checkout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
