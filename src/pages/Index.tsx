import { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';
import BannerSlider from '@/components/BannerSlider';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const { lang } = useTranslation();
  const { data: allProducts = [] } = useProducts();
  const { data: siteSettings } = useSettings();
  
  const homeBanners: string[] = Array.isArray(siteSettings?.homeBanners) ? siteSettings.homeBanners : [];
  const homeBannersMobile: string[] = Array.isArray(siteSettings?.homeBannersMobile) ? siteSettings.homeBannersMobile : [];
  const bannerHeight = Number(siteSettings?.bannerHeight) || 400;
  const bannerHeightMobile = Number(siteSettings?.bannerHeightMobile) || 220;

  const heroBg = siteSettings?.heroBackground || '/hero-bg-default.jpg'; // We can use a default if we want
  
  const getHeroTitle = () => {
    if (lang === 'ar' && siteSettings?.heroTitleAr) return siteSettings.heroTitleAr;
    if (lang === 'tr' && siteSettings?.heroTitleTr) return siteSettings.heroTitleTr;
    if (siteSettings?.heroTitleEn) return siteSettings.heroTitleEn;
    return '';
  };

  const getHeroSubtitle = () => {
    if (lang === 'ar' && siteSettings?.heroSubtitleAr) return siteSettings.heroSubtitleAr;
    if (lang === 'tr' && siteSettings?.heroSubtitleTr) return siteSettings.heroSubtitleTr;
    return siteSettings?.heroSubtitleEn || '';
  };

  const heroTitle = getHeroTitle();
  const heroSubtitle = getHeroSubtitle();

  return (
    <div className="bg-background min-h-screen pt-4 md:pt-8">
      <Helmet>
        <title>Arjwan Istanbul | Uzun Süre Kalıcı Kaliteli Parfümler</title>
        <meta name="description" content="Arjwan Istanbul - En kaliteli esanslarla üretilmiş, uzun süre kalıcı ve etkileyici niş ve tasarımcı muadili parfümler." />
      </Helmet>
      
      {/* Hero Section (Commercial Banner Style) */}
      <section className="px-4 mb-10">
        <div className="container mx-auto">
          {heroBg ? (
            <div className="relative w-full aspect-[4/5] md:aspect-[21/9] bg-secondary overflow-hidden rounded-sm">
              <img src={heroBg} alt="Promotion" className="w-full h-full object-cover" />
              {(heroTitle || heroSubtitle) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/30">
                  {heroTitle && <h1 className="text-3xl md:text-6xl font-bold text-white mb-2 md:mb-4 drop-shadow-md uppercase tracking-tight">{heroTitle}</h1>}
                  {heroSubtitle && <p className="text-lg md:text-2xl text-white font-medium drop-shadow-md">{heroSubtitle}</p>}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-[4/5] md:aspect-[21/9] bg-muted flex items-center justify-center rounded-sm">
              <p className="text-muted-foreground uppercase font-bold tracking-widest text-sm">Arjwan Istanbul</p>
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Offer Banners (If added by admin) */}
      {homeBanners.length > 0 && (
        <section className="px-4 mb-10">
          <div className="container mx-auto">
            <BannerSlider banners={homeBanners} bannersMobile={homeBannersMobile} height={bannerHeight} heightMobile={bannerHeightMobile} links={['/offers', '/offers']} />
          </div>
        </section>
      )}

      {/* Perfumes Collection (Commercial Layout) */}
      <section className="py-8 px-4 bg-background">
        <div className="container mx-auto max-w-[1400px]">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase tracking-tight mb-3">
              {lang === 'ar' ? 'أفضل مبيعاتنا' : lang === 'tr' ? 'EN ÇOK SATANLAR' : 'BEST SELLERS'}
            </h2>
            <div className="w-16 h-1 bg-foreground mx-auto" />
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:overflow-visible" style={{ scrollbarWidth: 'none' }}>
            {allProducts.map((product, i) => (
              <div key={product.id} className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-auto">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner (Hardcoded example matching commercial style) */}
      <section className="px-4 py-12 bg-secondary mt-8 mb-20">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-foreground uppercase tracking-tight mb-4">
            {lang === 'ar' ? 'اكتشف الفرق مع أرجوان' : lang === 'tr' ? 'ARJWAN FARKIYLA TANIŞIN' : 'DISCOVER THE ARJWAN DIFFERENCE'}
          </h2>
          <p className="text-muted-foreground font-medium max-w-2xl mx-auto mb-8">
            {lang === 'ar' ? 'عطور مركزة ومستوحاة من أرقى الماركات العالمية بثبات يدوم طويلاً.' : lang === 'tr' ? 'Dünyanın en iyi markalarından ilham alan, uzun süre kalıcı ve yoğun parfümler.' : 'Highly concentrated perfumes inspired by the best global brands with long-lasting projection.'}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
