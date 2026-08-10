import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useCartTotal } from '@/hooks/useCartTotal';
import { SHOW_PRICES } from '@/lib/config';

const FIELD_CLASS = (hasError: boolean) =>
  `w-full bg-secondary border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors rounded-sm ${
    hasError ? 'border-red-500' : 'border-border focus:border-primary'
  }`;

const CartPage = () => {
  const { t, lang } = useTranslation();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { subtotal, discountAmount, total } = useCartTotal(items);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const isRtl = lang === 'ar';

  const { data: settings } = useQuery<Record<string, any>>({
    queryKey: ['/api/settings'],
    queryFn: async () => { const r = await fetch('/api/settings'); return r.json(); },
    staleTime: 300_000,
  });
  const whatsappNumber = settings?.whatsappNumber || '905000000000';

  const set = (key: string, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = t('cart', 'nameRequired');
    if (!form.phone.trim()) errs.phone = t('cart', 'phoneRequired');
    if (!form.email.trim() || !form.email.includes('@')) errs.email = t('cart', 'emailRequired');
    if (!form.address.trim()) errs.address = t('cart', 'addressRequired');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCheckout = async () => {
    if (!validate()) return;
    setSubmitting(true);

    setSubmitting(true);

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
          customerName: form.name,
          whatsappPhone: form.phone.replace(/\D/g, ''),
          email: form.email,
          address: form.address,
          items: orderItems,
          subtotal: subtotal,
          discountAmount: discountAmount,
          total: total,
        }),
      });
    } catch {}

    const lines = items.map(item => {
      const concLabel = t('products', item.concentration);
      return `• ${item.name} (${item.size}, ${concLabel}) x${item.quantity} = ${item.price * item.quantity} TL`;
    });

    const message = [
      `🛍️ *Arjwan Istanbul - New Order*`,
      ``,
      `👤 ${form.name}`,
      `📱 ${form.phone}`,
      `📧 ${form.email}`,
      `📍 ${form.address}`,
      ``,
      `*Items:*`,
      ...lines,
      ``,
      discountAmount > 0 ? `🛒 *Subtotal: ${subtotal} TL*` : '',
      discountAmount > 0 ? `🎁 *Discount: -${discountAmount} TL*` : '',
      `💰 *Total: ${total} TL*`,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    setWhatsappUrl(url);
    clearCart();
    setSubmitting(false);
    setOrderSuccess(true);
  };

  // ── Empty cart ───────────────────────────────────────────────────────────
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full border border-border flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-muted-foreground" />
          </div>
          <h1 className="font-display text-3xl text-primary tracking-wider mb-3">{t('cart', 'empty')}</h1>
          <p className="text-muted-foreground text-sm mb-8">{t('cart', 'emptyDesc')}</p>
          <Link
            to="/perfumes"
            className="inline-block border border-primary text-primary px-10 py-3 text-xs tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all"
          >
            {t('cart', 'continueShopping')}
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Thank You screen ─────────────────────────────────────────────────────
  if (orderSuccess) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md w-full"
        >
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-28 h-28 rounded-full border-2 border-primary flex items-center justify-center mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 rounded-full bg-primary/5" />
            <CheckCircle2 size={52} className="text-primary" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="font-display text-5xl text-primary tracking-widest mb-3">
              {t('cart', 'thankYouTitle')}
            </h1>
            <p className="text-foreground text-lg mb-2">{t('cart', 'thankYouSubtitle')}</p>
            <p className="text-muted-foreground text-sm mb-10">{t('cart', 'thankYouDesc')}</p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(whatsappUrl, '_blank')}
              className="w-full bg-[#25D366] text-white py-4 text-sm tracking-widest uppercase hover:bg-[#1da851] transition-all flex items-center justify-center gap-3 rounded-sm mb-4 font-medium"
            >
              <MessageCircle size={20} />
              {t('cart', 'openWhatsapp')}
            </motion.button>

            <Link to="/perfumes" className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase">
              {t('cart', 'continueShopping')} →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ── Main cart page ───────────────────────────────────────────────────────
  return (
    <div className="pt-24 pb-16 px-4 min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl text-center text-primary tracking-widest mb-12"
        >
          {t('cart', 'title')}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── Left: Cart Items ── */}
          <div>
            <p className="text-xs tracking-widest text-muted-foreground uppercase mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-border inline-block" />
              {t('cart', 'yourItems')} ({items.length})
              <span className="flex-1 h-px bg-border inline-block" />
            </p>

            {/* COD Banner */}
            <div className="flex items-center gap-3 bg-[hsl(142_60%_20%/0.2)] border border-[hsl(142_60%_40%/0.35)] rounded-sm px-4 py-3 mb-5">
              <span className="text-lg">💵</span>
              <p className="text-sm text-green-400">
                {lang === 'ar'
                  ? 'الدفع عند الاستلام متاح — ادفع نقداً عند وصول طلبك'
                  : lang === 'tr'
                  ? 'Kapıda ödeme mevcut — siparişiniz geldiğinde nakit ödeyin'
                  : 'Cash on Delivery available — pay when your order arrives'}
              </p>
            </div>

            <AnimatePresence>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <motion.div
                    key={`${item.productId}-${item.size}-${item.concentration}`}
                    initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.06 }}
                    className="gold-border-glow rounded-sm bg-card p-4 flex gap-4 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-[72px] object-cover rounded-sm flex-shrink-0 bg-secondary"
                      width={56} height={72}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-primary font-display tracking-wider text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.size} • {t('products', item.concentration)}
                      </p>
                      {SHOW_PRICES && (
                        <p className="text-primary font-semibold mt-1.5 text-sm">{item.price * item.quantity} TL</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      <button
                        onClick={() => removeItem(item.productId, item.size, item.concentration)}
                        className="text-muted-foreground hover:text-red-400 transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.concentration, item.quantity - 1)}
                          className="w-6 h-6 border border-border rounded-sm flex items-center justify-center hover:border-primary transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-sm w-5 text-center tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.concentration, item.quantity + 1)}
                          className="w-6 h-6 border border-border rounded-sm flex items-center justify-center hover:border-primary transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {/* Order total */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-5 p-5 border border-border rounded-sm bg-card/50"
            >
              {SHOW_PRICES && (
                <div className="space-y-3">
                  {discountAmount > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm tracking-wider">{lang === 'ar' ? 'المجموع الفرعي' : lang === 'tr' ? 'Ara Toplam' : 'Subtotal'}</span>
                        <span className="text-xl text-foreground font-medium">{subtotal} TL</span>
                      </div>
                      <div className="flex items-center justify-between text-green-500">
                        <span className="text-sm tracking-wider font-medium">{lang === 'ar' ? 'الخصم' : lang === 'tr' ? 'İndirim' : 'Discount'}</span>
                        <span className="text-xl font-bold">-{discountAmount} TL</span>
                      </div>
                      <div className="h-px bg-border my-2" />
                    </>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm tracking-wider">{t('cart', 'total')}</span>
                    <span className="text-3xl text-primary font-display tracking-wider">{total} TL</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Right: Order Form ── */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:sticky lg:top-28"
          >
            <p className="text-xs tracking-widest text-muted-foreground uppercase mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-border inline-block" />
              {t('cart', 'orderDetails')}
              <span className="flex-1 h-px bg-border inline-block" />
            </p>

            <div className="gold-border-glow rounded-sm bg-card p-6 space-y-5">

              {/* Name */}
              <div>
                <label className="text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                  {t('cart', 'name')} <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder={t('cart', 'enterName')}
                  className={FIELD_CLASS(!!errors.name)}
                />
                {errors.name && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1.5">
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                  {t('cart', 'phone')} <span className="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+90 555 000 0000"
                  dir="ltr"
                  className={FIELD_CLASS(!!errors.phone)}
                />
                {errors.phone && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1.5">
                    {errors.phone}
                  </motion.p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                  {t('cart', 'email')} <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder={t('cart', 'enterEmail')}
                  dir="ltr"
                  className={FIELD_CLASS(!!errors.email)}
                />
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1.5">
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                  {t('cart', 'address')} <span className="text-primary">*</span>
                </label>
                <textarea
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  placeholder={t('cart', 'enterAddress')}
                  rows={3}
                  className={`${FIELD_CLASS(!!errors.address)} resize-none`}
                />
                {errors.address && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1.5">
                    {errors.address}
                  </motion.p>
                )}
              </div>

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleCheckout}
                disabled={submitting}
                className="w-full bg-[#25D366] text-white py-4 text-sm tracking-widest uppercase hover:bg-[#1da851] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm font-medium mt-1"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <MessageCircle size={18} />
                    {t('cart', 'checkout')}
                  </>
                )}
              </motion.button>

              <p className="text-xs text-muted-foreground text-center pt-1">
                {lang === 'ar' ? '* جميع الحقول مطلوبة' : lang === 'tr' ? '* Tüm alanlar zorunludur' : '* All fields are required'}
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
