import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/i18n/useTranslation';
import { toast } from 'sonner';
import { ShoppingBag, Gift } from 'lucide-react';

const BADGE_COLORS: Record<string, string> = {
  red:    'bg-red-500 text-white',
  gold:   'bg-[hsl(43_76%_52%)] text-black',
  purple: 'bg-[hsl(270_52%_34%)] text-white',
};

const CARD_BORDERS: Record<string, string> = {
  red:    'border-red-500/30',
  gold:   'border-[hsl(43_76%_52%/0.35)]',
  purple: 'border-[hsl(270_52%_34%/0.45)]',
};

const BADGE_BG: Record<string, string> = {
  red:    'bg-red-500/10 border-red-500/30 text-red-400',
  gold:   'bg-[hsl(43_76%_52%/0.12)] border-[hsl(43_76%_52%/0.35)] text-[hsl(43_76%_52%)]',
  purple: 'bg-[hsl(270_52%_34%/0.12)] border-[hsl(270_52%_34%/0.35)] text-[hsl(270_52%_60%)]',
};

const GRID_COLS: Record<number, string> = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

const KNOWN_DEFAULTS: Record<string, Record<string, any>> = {
  en: {
    'couples-eid': {
      heroSubtitle: 'His & Hers · Eid Collection',
      heroTitle: 'Eid Couples Collection',
      badgeText: 'Limited Stock · Eid Offer',
      badgeColor: 'red',
      title: 'Eid Couples Collection',
      tagline: 'The Perfect Eid Gift — For Him & For Her',
      price: 999,
      cartName: 'Eid Couples Collection — Aseel + Hürra (100ml each)',
      cartSize: '100ml',
      perfumes: [
        { id: 'aseel', image: '', name: 'Aseel | أصيل', description: 'Warm, woody, and boldly masculine. A signature scent that commands presence.', size: '100ml', badge: 'For Him', badgeColor: 'purple' },
        { id: 'hurra', image: '', name: 'Hürra | حرة',  description: 'Bold, floral, and beautifully free. A scent that celebrates the modern woman.',   size: '100ml', badge: 'For Her', badgeColor: 'gold'   },
      ],
    },
    'eid-triple': {
      heroSubtitle: 'Eid Collection · Three Signature Scents',
      heroTitle: 'Eid Triple Collection',
      badgeText: 'Best Value · Eid Offer',
      badgeColor: 'gold',
      title: 'Eid Triple Collection',
      tagline: 'Three Scents. One Unforgettable Gift.',
      price: 899,
      cartName: 'Eid Triple Collection — Aseel + Khayaal + Barri (50ml each)',
      cartSize: '50ml',
      perfumes: [
        { id: 'aseel',   image: '', name: 'Aseel | أصيل',   description: 'Warm & woody masculine signature',             size: '50ml', badge: '', badgeColor: 'purple' },
        { id: 'khayaal', image: '', name: 'Khayaal | خيال', description: 'Dreamy & unisex, for those who imagine beyond', size: '50ml', badge: '', badgeColor: 'gold'   },
        { id: 'barri',   image: '', name: 'Barri | بري',    description: 'Wild, fresh & boldly free',                    size: '50ml', badge: '', badgeColor: 'gold'   },
      ],
    },
  },
  ar: {
    'couples-eid': {
      heroSubtitle: 'له ولها · مجموعة العيد',
      heroTitle: 'مجموعة العيد للأزواج',
      badgeText: 'مخزون محدود · عرض العيد',
      badgeColor: 'red',
      title: 'مجموعة العيد للأزواج',
      tagline: 'هدية العيد المثالية — له ولها',
      price: 999,
      cartName: 'مجموعة العيد للأزواج — أصيل + حرة (100ml)',
      cartSize: '100ml',
      perfumes: [
        { id: 'aseel', image: '', name: 'Aseel | أصيل', description: 'دافئ، خشبي، وذكوري بجرأة. عطر مميز يفرض حضوره.',           size: '100ml', badge: 'له',  badgeColor: 'purple' },
        { id: 'hurra', image: '', name: 'Hürra | حرة',  description: 'جريئة، زهرية، وحرة جميلة. عطر يحتفي بالمرأة العصرية.',    size: '100ml', badge: 'لها', badgeColor: 'gold'   },
      ],
    },
    'eid-triple': {
      heroSubtitle: 'مجموعة العيد · ثلاثة عطور مميزة',
      heroTitle: 'مجموعة العيد الثلاثية',
      badgeText: 'أفضل قيمة · عرض العيد',
      badgeColor: 'gold',
      title: 'مجموعة العيد الثلاثية',
      tagline: 'ثلاثة عطور. هدية لا تُنسى.',
      price: 899,
      cartName: 'مجموعة العيد الثلاثية — أصيل + خيال + بري (50ml)',
      cartSize: '50ml',
      perfumes: [
        { id: 'aseel',   image: '', name: 'Aseel | أصيل',   description: 'عطر ذكوري دافئ وخشبي',                          size: '50ml', badge: '', badgeColor: 'purple' },
        { id: 'khayaal', image: '', name: 'Khayaal | خيال', description: 'حالم ومتعدد الأجناس، لمن يتخيل ما وراء الحدود', size: '50ml', badge: '', badgeColor: 'gold'   },
        { id: 'barri',   image: '', name: 'Barri | بري',    description: 'بري، منعش وجريء',                               size: '50ml', badge: '', badgeColor: 'gold'   },
      ],
    },
  },
  tr: {
    'couples-eid': {
      heroSubtitle: 'Ona ve Ona · Bayram Koleksiyonu',
      heroTitle: 'Bayram Çiftler Koleksiyonu',
      badgeText: 'Sınırlı Stok · Bayram Teklifi',
      badgeColor: 'red',
      title: 'Bayram Çiftler Koleksiyonu',
      tagline: 'Mükemmel Bayram Hediyesi — Ona ve Ona',
      price: 999,
      cartName: 'Bayram Çiftler Koleksiyonu — Aseel + Hürra (100ml)',
      cartSize: '100ml',
      perfumes: [
        { id: 'aseel', image: '', name: 'Aseel | أصيل', description: 'Sıcak, odunsu ve cesurca eril. Varlığını hissettiren bir imza kokusu.', size: '100ml', badge: 'Erkek', badgeColor: 'purple' },
        { id: 'hurra', image: '', name: 'Hürra | حرة',  description: 'Cesur, çiçeksi ve güzelce özgür. Modern kadını kutlayan bir koku.',      size: '100ml', badge: 'Kadın', badgeColor: 'gold'   },
      ],
    },
    'eid-triple': {
      heroSubtitle: 'Bayram Koleksiyonu · Üç İmza Kokusu',
      heroTitle: 'Bayram Üçlü Koleksiyonu',
      badgeText: 'En İyi Değer · Bayram Teklifi',
      badgeColor: 'gold',
      title: 'Bayram Üçlü Koleksiyonu',
      tagline: 'Üç Koku. Unutulmaz Bir Hediye.',
      price: 899,
      cartName: 'Bayram Üçlü Koleksiyonu — Aseel + Khayaal + Barri (50ml)',
      cartSize: '50ml',
      perfumes: [
        { id: 'aseel',   image: '', name: 'Aseel | أصيل',   description: 'Sıcak ve odunsu eril imza',            size: '50ml', badge: '', badgeColor: 'purple' },
        { id: 'khayaal', image: '', name: 'Khayaal | خيال', description: 'Hayalci ve unisex, hayal edebilenlere', size: '50ml', badge: '', badgeColor: 'gold'   },
        { id: 'barri',   image: '', name: 'Barri | بري',    description: 'Vahşi, taze ve cesurca özgür',          size: '50ml', badge: '', badgeColor: 'gold'   },
      ],
    },
  },
};

const BASE_DEFAULTS = {
  heroImage: '', heroSubtitle: '', heroTitle: '',
  badgeText: '', badgeColor: 'gold',
  title: '', tagline: '', price: 0,
  countdownDate: '2026-05-27', countdownLabel: '',
  cartName: '', cartSize: '',
  perfumes: [] as any[],
};

const getTimeLeft = (target: Date) => {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const Placeholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-[hsl(270_52%_8%)]">
    <img src="/bottle-gold.png" alt="" className="h-32 object-contain opacity-40" />
  </div>
);

const BundlePage = () => {
  const { bundleId } = useParams<{ bundleId: string }>();
  const { t, lang } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const { data: siteSettings } = useSettings();

  const langDefaults = KNOWN_DEFAULTS[lang] || KNOWN_DEFAULTS.en;
  const knownDefaults = langDefaults[bundleId!] || {};
  const savedConfig = siteSettings?.bundleConfigs?.[bundleId!] || {};
  const b = { ...BASE_DEFAULTS, ...knownDefaults, ...savedConfig };

  const eidDate = new Date(`${b.countdownDate}T00:00:00`);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(eidDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(eidDate)), 1000);
    return () => clearInterval(timer);
  }, [b.countdownDate]);

  const handleAddToCart = () => {
    addItem({
      productId: `bundle-${bundleId}`,
      name: b.cartName || b.title,
      size: '50ml',
      quantity: 1,
      price: Number(b.price),
      image: b.perfumes[0]?.image || '/bottle-gold.png',
    });
    toast.success(t('bundles', 'addedToCart'));
  };

  const countdown = [
    { label: t('bundles', 'days'),  value: timeLeft.days },
    { label: t('bundles', 'hours'), value: timeLeft.hours },
    { label: t('bundles', 'min'),   value: timeLeft.minutes },
    { label: t('bundles', 'sec'),   value: timeLeft.seconds },
  ];

  const colClass = GRID_COLS[b.perfumes.length] ?? GRID_COLS[2];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[360px] overflow-hidden">
        {b.heroImage
          ? <img src={b.heroImage} alt={b.heroTitle} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-[hsl(270_52%_8%)] to-[hsl(43_76%_8%)]" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          {b.heroSubtitle && (
            <p className="text-[hsl(43_76%_52%)] text-xs tracking-[0.5em] uppercase mb-4">{b.heroSubtitle}</p>
          )}
          <h1 className="font-display text-4xl md:text-6xl text-foreground tracking-wider">{b.heroTitle}</h1>
        </motion.div>
      </section>

      {/* Details */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">

          {/* Title block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center mb-12"
          >
            {b.badgeText && (
              <span className={`inline-flex items-center gap-2 border text-[11px] tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-6 ${BADGE_BG[b.badgeColor] || BADGE_BG.gold}`}>
                {b.badgeText}
              </span>
            )}
            <h2 className="font-display text-3xl md:text-4xl text-primary tracking-wider mb-2">{b.title}</h2>
            {b.tagline && <p className="text-muted-foreground text-lg mb-6">{b.tagline}</p>}
            <span className="font-display text-5xl text-[hsl(43_76%_52%)] tracking-wider">₺{b.price}</span>
          </motion.div>

          {/* Perfume cards */}
          {b.perfumes.length > 0 && (
            <div className={`grid grid-cols-1 ${colClass} gap-6 mb-12`}>
              {b.perfumes.map((perf: any, i: number) => (
                <motion.div
                  key={perf.id || i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`bg-card border rounded-sm overflow-hidden ${CARD_BORDERS[perf.badgeColor] || CARD_BORDERS.purple}`}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    {perf.image
                      ? <img src={perf.image} alt={perf.name} className="w-full h-full object-cover" />
                      : <Placeholder />
                    }
                    {perf.badge && (
                      <span className={`absolute top-3 start-3 text-[10px] tracking-[0.3em] uppercase px-3 py-1 ${BADGE_COLORS[perf.badgeColor] || BADGE_COLORS.purple}`}>
                        {perf.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-primary tracking-wider mb-1">{perf.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{perf.description}</p>
                    <span className="text-xs text-muted-foreground/60 tracking-widest uppercase border border-border px-2.5 py-1">
                      {perf.size}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex flex-col items-center gap-4 mb-16">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 bg-[hsl(43_76%_52%)] text-black px-10 py-4 text-sm tracking-widest uppercase font-semibold hover:bg-[hsl(43_76%_60%)] transition-colors w-full sm:w-auto gold-glow"
            >
              <ShoppingBag size={18} />
              {t('bundles', 'addToCart')} — ₺{b.price}
            </button>
            <p className="flex items-center gap-2 text-muted-foreground text-sm">
              <Gift size={14} />
              {t('bundles', 'giftWrapping')}
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-card border border-border rounded-sm p-8 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-8">
              {b.countdownLabel || t('bundles', 'countdownLabel')}
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

export default BundlePage;
