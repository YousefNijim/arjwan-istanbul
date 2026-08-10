import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { ShoppingBag, Gift } from 'lucide-react';

// ── Replace these with actual uploaded image URLs ────────────────────────────
const HERO_IMAGE = '';
const ASEEL_IMAGE = '';
const KHAYAAL_IMAGE = '';
const BARRI_IMAGE = '';
// ─────────────────────────────────────────────────────────────────────────────

const BUNDLE_PRICE = 899;
const EID_DATE = new Date('2026-05-27T00:00:00');

const getTimeLeft = (target: Date) => {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const Placeholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-[hsl(270_52%_8%)]">
    <img src="/bottle-gold.png" alt="" className="h-32 object-contain opacity-40" />
  </div>
);

const PRODUCTS = [
  {
    image: ASEEL_IMAGE,
    name: 'Aseel | أصيل',
    desc: 'Warm & woody masculine signature',
    size: '50ml',
    delay: 0.2,
  },
  {
    image: KHAYAAL_IMAGE,
    name: 'Khayaal | خيال',
    desc: 'Dreamy & unisex, for those who imagine beyond',
    size: '50ml',
    delay: 0.3,
  },
  {
    image: BARRI_IMAGE,
    name: 'Barri | بري',
    desc: 'Wild, fresh & boldly free',
    size: '50ml',
    delay: 0.4,
  },
];

const EidTripleBundle = () => {
  const addItem = useCartStore((s) => s.addItem);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(EID_DATE));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(EID_DATE)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = () => {
    addItem({
      productId: 'bundle-eid-triple',
      name: 'Eid Triple Collection — Aseel + Khayaal + Barri (50ml each)',
      size: '50ml',
      quantity: 1,
      price: BUNDLE_PRICE,
      image: ASEEL_IMAGE || '/bottle-gold.png',
    });
    toast.success('Bundle added to cart 🛍️');
  };

  const countdown = [
    { label: 'Days',  value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Min',   value: timeLeft.minutes },
    { label: 'Sec',   value: timeLeft.seconds },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[360px] overflow-hidden">
        {HERO_IMAGE
          ? <img src={HERO_IMAGE} alt="Eid Triple Collection" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-[hsl(43_76%_8%)] to-[hsl(270_52%_15%)]" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <p className="text-[hsl(43_76%_52%)] text-xs tracking-[0.5em] uppercase mb-4">
            Eid Collection · Three Signature Scents
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground tracking-wider">
            Eid Triple Collection
          </h1>
        </motion.div>
      </section>

      {/* ── Details ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">

          {/* Title block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-[hsl(43_76%_52%/0.12)] border border-[hsl(43_76%_52%/0.35)] text-[hsl(43_76%_52%)] text-[11px] tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-6">
              Best Value · Eid Offer
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-primary tracking-wider mb-2">
              Eid Triple Collection
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Three Scents. One Unforgettable Gift.
            </p>
            <span className="font-display text-5xl text-[hsl(43_76%_52%)] tracking-wider">
              ₺{BUNDLE_PRICE}
            </span>
          </motion.div>

          {/* Product cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {PRODUCTS.map((p) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: p.delay }}
                className="bg-card border border-[hsl(270_52%_34%/0.45)] hover:border-[hsl(43_76%_52%/0.45)] transition-colors rounded-sm overflow-hidden"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    : <Placeholder />
                  }
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-primary tracking-wider mb-1">{p.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{p.desc}</p>
                  <span className="text-xs text-muted-foreground/60 tracking-widest uppercase border border-border px-2.5 py-1">
                    {p.size}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col items-center gap-4 mb-16">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 bg-[hsl(43_76%_52%)] text-black px-10 py-4 text-sm tracking-widest uppercase font-semibold hover:bg-[hsl(43_76%_60%)] transition-colors w-full sm:w-auto gold-glow"
            >
              <ShoppingBag size={18} />
              Add to Cart — ₺{BUNDLE_PRICE}
            </button>
            <p className="flex items-center gap-2 text-muted-foreground text-sm">
              <Gift size={14} />
              Free gift wrapping included 🎁
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-card border border-border rounded-sm p-8 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-8">
              Eid offer ends soon
            </p>
            <div className="flex items-center justify-center gap-6 sm:gap-10">
              {countdown.map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <span className="font-display text-4xl sm:text-5xl text-[hsl(43_76%_52%)] tabular-nums w-16 text-center leading-none">
                    {String(value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-muted-foreground/50">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default EidTripleBundle;
