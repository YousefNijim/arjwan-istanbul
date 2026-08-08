import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import { useProducts } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';
import BannerSlider from '@/components/BannerSlider';

const heroImages = [hero1, hero2];

const Index = () => {
  const { t, lang } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: allProducts = [] } = useProducts();
  const { data: siteSettings } = useSettings();
  
  const homeBanners: string[] = Array.isArray(siteSettings?.homeBanners) ? siteSettings.homeBanners : [];
  const homeBannersMobile: string[] = Array.isArray(siteSettings?.homeBannersMobile) ? siteSettings.homeBannersMobile : [];
  const bannerHeight = Number(siteSettings?.bannerHeight) || 400;
  const bannerHeightMobile = Number(siteSettings?.bannerHeightMobile) || 220;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const heroBg = siteSettings?.heroBackground;
  
  const getHeroTitle = () => {
    if (lang === 'ar' && siteSettings?.heroTitleAr) return siteSettings.heroTitleAr;
    if (lang === 'tr' && siteSettings?.heroTitleTr) return siteSettings.heroTitleTr;
    if (siteSettings?.heroTitleEn) return siteSettings.heroTitleEn;
    return t('hero', 'tagline');
  };

  const getHeroSubtitle = () => {
    if (lang === 'ar' && siteSettings?.heroSubtitleAr) return siteSettings.heroSubtitleAr;
    if (lang === 'tr' && siteSettings?.heroSubtitleTr) return siteSettings.heroSubtitleTr;
    return siteSettings?.heroSubtitleEn || '';
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-secondary">
        {heroBg ? (
          <div className="absolute inset-0">
            <img src={heroBg} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
          </div>
        ) : (
          heroImages.map((img, i) => (
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
              />
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
            </div>
          ))
        )}

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <img
              src={siteSettings?.customLogoUrl || "/arjwan_logo_transparent.png"}
              alt="Arjwan Istanbul"
              className="h-32 md:h-48 w-auto object-contain mx-auto mb-8 opacity-90"
            />
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-6 leading-tight">
              {getHeroTitle()}
            </h1>
            
            {getHeroSubtitle() && (
              <p className="text-foreground/70 text-lg md:text-xl mb-10 font-body max-w-2xl mx-auto">
                {getHeroSubtitle()}
              </p>
            )}

            <Link
              to="/perfumes"
              className="inline-block bg-foreground text-background px-10 py-4 text-sm tracking-widest uppercase hover:bg-foreground/80 transition-all shadow-xl"
            >
              {t('hero', 'shopNow')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Offer Banners */}
      {homeBanners.length > 0 && (
        <section className="px-4 py-8">
          <div className="container mx-auto">
            <BannerSlider banners={homeBanners} bannersMobile={homeBannersMobile} height={bannerHeight} heightMobile={bannerHeightMobile} links={['/offers', '/offers']} />
          </div>
        </section>
      )}

      {/* Perfumes Collection */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-wider mb-4">
              {lang === 'ar' ? 'مجموعة العطور الخاصة بنا' : lang === 'tr' ? 'Parfüm Koleksiyonumuz' : 'Our Perfume Collection'}
            </h2>
            <div className="w-12 h-0.5 bg-primary mx-auto" />
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
            {allProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
