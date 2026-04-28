import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/useTranslation';
import { RefreshCw, CheckCircle2, XCircle, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const ReturnsPage = () => {
  const { lang } = useTranslation();
  const isRtl = lang === 'ar';

  const { data: settings } = useQuery<Record<string, any>>({
    queryKey: ['/api/settings'],
    queryFn: async () => { const r = await fetch('/api/settings'); return r.json(); },
    staleTime: 300_000,
  });
  const whatsappNumber = settings?.whatsappNumber || '905000000000';

  const c = {
    title: { ar: 'سياسة الإرجاع والاستبدال', en: 'Returns & Exchanges', tr: 'İade ve Değişim Politikası' },
    subtitle: {
      ar: 'رضاك أولويتنا — نلتزم بتجربة تسوق مريحة وآمنة',
      en: 'Your satisfaction is our priority — a safe and comfortable shopping experience',
      tr: 'Memnuniyetiniz önceliğimiz — güvenli ve rahat bir alışveriş deneyimi',
    },
    window: { ar: '7 أيام للإرجاع', en: '7-Day Return Window', tr: '7 Günlük İade Süresi' },
    windowDesc: {
      ar: 'يمكنك إرجاع المنتجات خلال 7 أيام من تاريخ الاستلام',
      en: 'You can return products within 7 days of receiving your order',
      tr: 'Ürünleri teslim aldıktan sonra 7 gün içinde iade edebilirsiniz',
    },
    eligibleTitle: { ar: 'حالات الإرجاع المقبولة', en: 'Accepted Return Conditions', tr: 'Kabul Edilen İade Koşulları' },
    eligible: {
      ar: ['المنتج لم يُستخدم ومغلق بشكل صحيح', 'المنتج وصل تالفاً أو معيباً', 'المنتج لا يطابق الوصف المذكور'],
      en: ['Product is unused and properly sealed', 'Product arrived damaged or defective', 'Product does not match the description'],
      tr: ['Ürün kullanılmamış ve düzgün şekilde mühürlenmiş', 'Ürün hasarlı veya kusurlu geldi', 'Ürün açıklamayla eşleşmiyor'],
    },
    notEligibleTitle: { ar: 'حالات لا تُقبل فيها الإرجاع', en: 'Non-Returnable Cases', tr: 'İade Edilemeyen Durumlar' },
    notEligible: {
      ar: ['المنتج المستخدم جزئياً أو المفتوح', 'مرور أكثر من 7 أيام من الاستلام', 'طلبات التغيير بسبب تفضيل شخصي'],
      en: ['Partially used or opened product', 'More than 7 days have passed since delivery', 'Change of personal preference'],
      tr: ['Kısmen kullanılmış veya açılmış ürün', 'Teslimatten 7 günden fazla geçmişse', 'Kişisel tercih değişikliği'],
    },
    howTitle: { ar: 'كيفية تقديم طلب إرجاع', en: 'How to Request a Return', tr: 'İade Nasıl Talep Edilir' },
    steps: {
      ar: ['تواصل معنا عبر واتساب مع رقم طلبك', 'أرسل صورة للمنتج إذا كان تالفاً', 'سنرد خلال 24 ساعة وننسق عملية الاستلام'],
      en: ['Contact us on WhatsApp with your order number', 'Send a photo of the product if it is damaged', 'We will respond within 24 hours and arrange pickup'],
      tr: ['Sipariş numaranızla WhatsApp\'tan bize ulaşın', 'Ürün hasarlıysa fotoğraf gönderin', '24 saat içinde yanıt verip teslim alımı ayarlayacağız'],
    },
  };

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    lang === 'ar' ? 'مرحباً، أريد تقديم طلب إرجاع' :
    lang === 'tr' ? 'Merhaba, iade talep etmek istiyorum' :
    'Hello, I would like to request a return'
  )}`;

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <RefreshCw className="text-primary mx-auto mb-4" size={36} />
          <h1 className="font-display text-3xl md:text-4xl text-primary tracking-wider mb-3">{c.title[lang]}</h1>
          <p className="text-muted-foreground">{c.subtitle[lang]}</p>
        </motion.div>

        {/* Window */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-[hsl(270_52%_34%/0.3)] rounded-sm p-6 mb-6 text-center">
          <p className="font-display text-2xl text-primary tracking-wider mb-1">{c.window[lang]}</p>
          <p className="text-muted-foreground text-sm">{c.windowDesc[lang]}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Eligible */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-[hsl(142_60%_20%/0.15)] border border-[hsl(142_60%_40%/0.35)] rounded-sm p-5">
            <h3 className="font-display text-green-400 tracking-wide mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} /> {c.eligibleTitle[lang]}
            </h3>
            <ul className="space-y-2">
              {c.eligible[lang].map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Not eligible */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-[hsl(0_60%_20%/0.15)] border border-[hsl(0_60%_40%/0.35)] rounded-sm p-5">
            <h3 className="font-display text-red-400 tracking-wide mb-3 flex items-center gap-2">
              <XCircle size={18} /> {c.notEligibleTitle[lang]}
            </h3>
            <ul className="space-y-2">
              {c.notEligible[lang].map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✕</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Steps */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card border border-[hsl(270_52%_34%/0.3)] rounded-sm p-6 mb-6">
          <h3 className="font-display text-primary tracking-wide mb-4">{c.howTitle[lang]}</h3>
          <ol className="space-y-3">
            {c.steps[lang].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 font-bold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 text-sm tracking-widest uppercase rounded-sm hover:bg-[#1da851] transition-all font-medium"
        >
          <MessageCircle size={18} />
          {lang === 'ar' ? 'تواصل معنا عبر واتساب' : lang === 'tr' ? 'WhatsApp\'tan Bize Yazın' : 'Contact Us on WhatsApp'}
        </motion.a>
      </div>
    </div>
  );
};

export default ReturnsPage;
