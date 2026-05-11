import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import categoryMen from '@/assets/category-men.jpg';
import categoryWomen from '@/assets/category-women.jpg';
import { useProducts } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';
import BannerSlider from '@/components/BannerSlider';
import { ShieldCheck, Truck, Gem, Star } from 'lucide-react';

const heroImages = [hero1, hero2];

const Index = () => {
  const { t, lang } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const { data: allProducts = [] } = useProducts();
  const featured = allProducts.filter((p) => p.featured);
  const { data: siteSettings } = useSettings();
  const homeBanners: string[] = Array.isArray(siteSettings?.homeBanners) ? siteSettings.homeBanners : [];
  const bannerHeight = Number(siteSettings?.bannerHeight) || 400;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt="Arjwan Istanbul"
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />
          </div>
        ))}

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <img
              src="/arjwan_logo_transparent.png"
              alt="Arjwan Istanbul"
              className="h-40 md:h-56 lg:h-64 w-auto object-contain mx-auto mb-6 drop-shadow-2xl"
            />
            <p className="text-foreground/70 text-lg md:text-xl max-w-md mx-auto mb-4 font-body">
              {t('hero', 'tagline')}
            </p>
            {/* UVP trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <span className="flex items-center gap-1.5 text-xs tracking-wider text-foreground/60 border border-border/50 px-3 py-1.5 rounded-full bg-background/30 backdrop-blur-sm">
                <ShieldCheck size={12} className="text-primary" />
                {lang === 'ar' ? 'ضمان الأصالة' : lang === 'tr' ? 'Özgünlük Garantisi' : 'Authenticity Guaranteed'}
              </span>
              <span className="flex items-center gap-1.5 text-xs tracking-wider text-foreground/60 border border-border/50 px-3 py-1.5 rounded-full bg-background/30 backdrop-blur-sm">
                <Gem size={12} className="text-primary" />
                {lang === 'ar' ? 'زيوت فرنسية وسويسرية' : lang === 'tr' ? 'Fransız & İsviçre Yağları' : 'French & Swiss Grade Oils'}
              </span>
              <span className="flex items-center gap-1.5 text-xs tracking-wider text-foreground/60 border border-border/50 px-3 py-1.5 rounded-full bg-background/30 backdrop-blur-sm">
                <Truck size={12} className="text-primary" />
                {lang === 'ar' ? 'شحن لتركيا' : lang === 'tr' ? 'Türkiye Geneli Kargo' : 'Ships Across Turkey'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/perfumes"
                className="bg-primary text-primary-foreground px-8 py-3 text-sm tracking-widest uppercase hover:bg-primary/90 transition-all gold-glow"
              >
                {t('hero', 'shopNow')}
              </Link>
              <Link
                to="/perfumes"
                className="border border-primary/30 text-primary px-8 py-3 text-sm tracking-widest uppercase hover:bg-primary/10 transition-all"
              >
                {t('hero', 'discover')}
              </Link>
            </div>
          </motion.div>

          {/* Slide indicators */}
          <div className="absolute bottom-8 flex gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-8 h-0.5 transition-all ${
                  i === currentSlide ? 'bg-primary w-12' : 'bg-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Offer Banners */}
      {homeBanners.length > 0 && (
        <section className="px-4 py-6">
          <div className="container mx-auto">
            <BannerSlider banners={homeBanners} height={bannerHeight} />
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl text-center text-primary tracking-wider mb-12"
          >
            {t('sections', 'featured')}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl text-center text-primary tracking-wider mb-12"
          >
            {t('sections', 'categories')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { key: 'men', img: categoryMen, cat: 'men' },
              { key: 'women', img: categoryWomen, cat: 'women' },
            ].map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Link
                  to={`/perfumes?category=${item.cat}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-sm"
                >
                  <img
                    src={item.img}
                    alt={t('sections', item.key)}
                    loading="lazy"
                    width={800}
                    height={1024}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-8 inset-x-0 text-center">
                    <h3 className="font-display text-2xl text-primary tracking-[0.3em] uppercase">
                      {t('sections', item.key)}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspired Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8 max-w-xs mx-auto">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[hsl(270_52%_34%/0.5)] to-transparent" />
              <div className="w-2 h-2 rotate-45 border border-primary/50" />
              <div className="w-1 h-1 rotate-45 bg-primary/40" />
              <div className="w-2 h-2 rotate-45 border border-primary/50" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[hsl(270_52%_34%/0.5)] to-transparent" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-primary tracking-wider mb-6">
              {t('sections', 'inspired')}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t('sections', 'inspiredDesc')}
            </p>
            <div className="flex items-center gap-4 mt-8 max-w-xs mx-auto">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[hsl(270_52%_34%/0.5)] to-transparent" />
              <div className="w-2 h-2 rotate-45 border border-primary/50" />
              <div className="w-1 h-1 rotate-45 bg-primary/40" />
              <div className="w-2 h-2 rotate-45 border border-primary/50" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[hsl(270_52%_34%/0.5)] to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Arjwan */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl text-center text-primary tracking-wider mb-12"
          >
            {lang === 'ar' ? 'لماذا أرجوان إسطنبول؟' : lang === 'tr' ? 'Neden Arjwan İstanbul?' : 'Why Choose Arjwan?'}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: ShieldCheck,
                title: { ar: 'ضمان الأصالة', en: 'Authenticity Guarantee', tr: 'Özgünlük Garantisi' },
                desc: { ar: 'كل عطر نقدمه مضمون الأصالة — لا غش ولا تقليد، فقط جودة لا مثيل لها', en: "Every fragrance we offer is guaranteed authentic — no fakes, no imitations, only unmatched quality", tr: "Sunduğumuz her parfüm özgünlük garantisi taşır — sahte yok, sadece eşsiz kalite" },
              },
              {
                icon: Gem,
                title: { ar: 'زيوت فرنسية وسويسرية', en: 'French & Swiss Grade Oils', tr: 'Fransız & İsviçre Yağları' },
                desc: { ar: 'نستخدم أجود الزيوت العطرية المستوردة من فرنسا وسويسرا لثبات لا يُضاهى طوال اليوم', en: "We use the finest fragrance oils imported from France and Switzerland for all-day unmatched longevity", tr: "Gün boyu eşsiz kalıcılık için Fransa ve İsviçre'den ithal en kaliteli parfüm yağlarını kullanıyoruz" },
              },
              {
                icon: Truck,
                title: { ar: 'توصيل سريع', en: 'Fast Delivery', tr: 'Hızlı Teslimat' },
                desc: { ar: 'توصيل سريع في إسطنبول خلال 1-2 يوم، وعبر تركيا خلال 3-5 أيام مع خيار الدفع عند الاستلام', en: "Fast delivery in Istanbul within 1-2 days, across Turkey in 3-5 days with Cash on Delivery option", tr: "İstanbul'da 1-2 günde, Türkiye genelinde 3-5 günde hızlı teslimat, kapıda ödeme seçeneğiyle" },
              },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center bg-card border border-[hsl(270_52%_34%/0.3)] rounded-sm p-8 hover:border-primary/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <pillar.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-primary tracking-wider text-lg mb-3">{pillar.title[lang]}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{pillar.desc[lang]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl text-center text-primary tracking-wider mb-12"
          >
            {t('sections', 'testimonials')}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: { ar: 'سارة م.', en: 'Sara M.', tr: 'Sara M.' },
                location: { ar: 'إسطنبول', en: 'Istanbul', tr: 'İstanbul' },
                text: { ar: 'اشتريت عطراً كهدية لزوجي وكان مذهلاً! الرائحة تدوم طوال اليوم والتغليف فاخر جداً.', en: "I bought a fragrance as a gift for my husband and it was amazing! The scent lasts all day and the packaging is so luxurious.", tr: "Kocama hediye olarak bir parfüm aldım ve muhteşemdi! Koku gün boyu sürüyor ve ambalaj çok lüks." },
              },
              {
                name: { ar: 'أحمد ك.', en: 'Ahmed K.', tr: 'Ahmet K.' },
                location: { ar: 'أنقرة', en: 'Ankara', tr: 'Ankara' },
                text: { ar: 'جودة استثنائية بسعر معقول. لا أصدق أنها مستوحاة من ماركات عالمية — الرائحة متطابقة تقريباً!', en: "Exceptional quality at a reasonable price. I can't believe these are inspired by global brands — the scent is nearly identical!", tr: "Makul fiyata olağanüstü kalite. Bunların dünya markalarından ilham aldığına inanamıyorum — koku neredeyse aynı!" },
              },
              {
                name: { ar: 'لينا ح.', en: 'Lina H.', tr: 'Lina H.' },
                location: { ar: 'إسطنبول', en: 'Istanbul', tr: 'İstanbul' },
                text: { ar: 'التوصيل كان سريعاً جداً والعطر رائع. أنصح به بشدة لكل من يبحث عن عطر فاخر.', en: "Delivery was super fast and the perfume is wonderful. Highly recommend to anyone looking for a luxury fragrance.", tr: "Teslimat çok hızlıydı ve parfüm harika. Lüks bir parfüm arayan herkese kesinlikle tavsiye ederim." },
              },
              {
                name: { ar: 'عمر ي.', en: 'Omar Y.', tr: 'Ömer Y.' },
                location: { ar: 'إزمير', en: 'Izmir', tr: 'İzmir' },
                text: { ar: 'الخدمة ممتازة والمنتج أفضل من توقعاتي. سأعود للشراء مرة أخرى بالتأكيد.', en: "Excellent service and the product exceeded my expectations. I will definitely come back to buy again.", tr: "Mükemmel hizmet ve ürün beklentilerimi aştı. Kesinlikle tekrar satın almaya geleceğim." },
              },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background border border-[hsl(270_52%_34%/0.3)] rounded-sm p-6 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} className="fill-[hsl(43_76%_52%)] text-[hsl(43_76%_52%)]" />)}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5 italic">"{review.text[lang]}"</p>
                <div>
                  <p className="text-primary text-sm font-medium tracking-wide">{review.name[lang]}</p>
                  <p className="text-muted-foreground/60 text-xs">{review.location[lang]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
                {t('sections', 'brandStory')}
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-primary tracking-wider mb-6">
                {t('sections', 'brandStoryTitle')}
              </h2>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-[hsl(270_52%_34%/0.6)] to-transparent" />
                <div className="w-2 h-2 rotate-45 border border-[hsl(270_52%_50%/0.5)]" />
              </div>
              <p className="text-foreground/70 leading-relaxed text-lg">
                {t('sections', 'brandStoryText')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 flex justify-center"
            >
              <div className="relative max-w-xs w-full">
                <div className="absolute inset-0 border border-[hsl(270_52%_34%/0.4)] rounded-sm -translate-x-2 -translate-y-2" />
                <img
                  src="/packaging.png"
                  alt="Arjwan Istanbul Packaging"
                  className="relative z-10 w-full rounded-sm object-contain"
                  loading="lazy"
                />
                <div className="absolute inset-0 border border-[hsl(43_76%_52%/0.2)] rounded-sm translate-x-2 translate-y-2" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl text-primary tracking-wider mb-3">
              {t('sections', 'newsletter')}
            </h2>
            <p className="text-muted-foreground mb-6">{t('sections', 'newsletterDesc')}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail('');
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('sections', 'email')}
                className="flex-1 bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-3 text-sm tracking-widest uppercase hover:bg-primary/90 transition-all"
              >
                {t('sections', 'subscribe')}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
