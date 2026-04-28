import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/useTranslation';
import { Truck, RefreshCw, ShieldCheck, Clock } from 'lucide-react';

const ShippingPage = () => {
  const { lang } = useTranslation();
  const isRtl = lang === 'ar';

  const content = {
    title: {
      ar: 'الشحن والتوصيل',
      en: 'Shipping & Delivery',
      tr: 'Kargo ve Teslimat',
    },
    subtitle: {
      ar: 'نوصل عطورك بعناية إلى باب منزلك',
      en: 'We deliver your fragrances carefully to your doorstep',
      tr: 'Parfümlerinizi itina ile kapınıza teslim ediyoruz',
    },
    zones: [
      {
        icon: Clock,
        title: { ar: 'إسطنبول', en: 'Istanbul', tr: 'İstanbul' },
        desc: {
          ar: 'التوصيل خلال 1-2 يوم عمل',
          en: '1–2 business days delivery',
          tr: '1–2 iş günü teslimat',
        },
      },
      {
        icon: Truck,
        title: { ar: 'تركيا — سائر المدن', en: 'Turkey — All Cities', tr: 'Türkiye — Tüm Şehirler' },
        desc: {
          ar: 'التوصيل خلال 3-5 أيام عمل',
          en: '3–5 business days delivery',
          tr: '3–5 iş günü teslimat',
        },
      },
    ],
    codTitle: { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery', tr: 'Kapıda Ödeme' },
    codDesc: {
      ar: 'نقبل الدفع نقداً عند استلام طلبك — لا حاجة لبطاقة ائتمان',
      en: 'We accept cash payment upon delivery — no credit card needed',
      tr: 'Siparişinizi teslim aldığınızda nakit ödeme yapabilirsiniz — kredi kartı gerekmez',
    },
    freeTitle: { ar: 'شحن مجاني', en: 'Free Shipping', tr: 'Ücretsiz Kargo' },
    freeDesc: {
      ar: 'شحن مجاني للطلبات التي تتجاوز 1000 ليرة تركية',
      en: 'Free shipping on orders over 1,000 TL',
      tr: '1.000 TL üzerindeki siparişlerde ücretsiz kargo',
    },
    packTitle: { ar: 'تغليف فاخر', en: 'Luxury Packaging', tr: 'Lüks Ambalaj' },
    packDesc: {
      ar: 'كل طلب يُعبّأ بعناية في صناديق فاخرة مناسبة للإهداء',
      en: 'Every order is carefully packed in luxury gift-ready boxes',
      tr: 'Her sipariş, hediye için uygun lüks kutularda özenle paketlenir',
    },
  };

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <Truck className="text-primary mx-auto mb-4" size={36} />
          <h1 className="font-display text-3xl md:text-4xl text-primary tracking-wider mb-3">
            {content.title[lang]}
          </h1>
          <p className="text-muted-foreground">{content.subtitle[lang]}</p>
        </motion.div>

        {/* Delivery Zones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          {content.zones.map((zone, i) => (
            <div
              key={i}
              className="bg-card border border-[hsl(270_52%_34%/0.3)] rounded-sm p-6 hover:border-primary/50 transition-colors"
            >
              <zone.icon className="text-primary mb-3" size={22} />
              <h3 className="font-display text-primary tracking-wide mb-1">{zone.title[lang]}</h3>
              <p className="text-muted-foreground text-sm">{zone.desc[lang]}</p>
            </div>
          ))}
        </motion.div>

        {/* Info Cards */}
        {[
          { title: content.codTitle, desc: content.codDesc, icon: ShieldCheck, accent: true },
          { title: content.freeTitle, desc: content.freeDesc, icon: Truck, accent: false },
          { title: content.packTitle, desc: content.packDesc, icon: RefreshCw, accent: false },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className={`flex gap-4 items-start p-6 rounded-sm mb-4 border ${
              card.accent
                ? 'bg-[hsl(142_60%_20%/0.2)] border-[hsl(142_60%_40%/0.4)]'
                : 'bg-card border-[hsl(270_52%_34%/0.3)]'
            }`}
          >
            <card.icon
              className={card.accent ? 'text-green-400 shrink-0 mt-0.5' : 'text-primary shrink-0 mt-0.5'}
              size={22}
            />
            <div>
              <h3 className="font-display tracking-wide text-primary mb-1">{card.title[lang]}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{card.desc[lang]}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShippingPage;
