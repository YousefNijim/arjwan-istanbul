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
  const midBanners: string[] = Array.isArray(siteSettings?.perfumeBanners) ? siteSettings.perfumeBanners : [];
  const midBannersMobile: string[] = Array.isArray(siteSettings?.perfumeBannersMobile) ? siteSettings.perfumeBannersMobile : [];
  
  const bannerHeight = Number(siteSettings?.bannerHeight) || 400;
  const bannerHeightMobile = Number(siteSettings?.bannerHeightMobile) || 220;
  
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

  const getSliderProducts = (category: string) => {
    if (!category || category === 'hidden') return [];
    if (category === 'all') return allProducts;
    return allProducts.filter(p => p.category === category);
  };

  const slider1Products = getSliderProducts(siteSettings?.productSlider1Category || 'all');
  const slider2Products = getSliderProducts(siteSettings?.productSlider2Category || 'women');
  const slider3Products = getSliderProducts(siteSettings?.productSlider3Category || 'men');

  const getSliderTitle = (num: 1|2|3, defaultAr: string, defaultEn: string, defaultTr: string) => {
    if (lang === 'ar') return siteSettings?.[`productSlider${num}TitleAr`] || defaultAr;
    if (lang === 'tr') return siteSettings?.[`productSlider${num}TitleTr`] || defaultTr;
    return siteSettings?.[`productSlider${num}TitleEn`] || defaultEn;
  };

  return (
    <div className="bg-background min-h-screen pt-0 md:pt-4">
      <Helmet>
        <title>Arjwan Istanbul | Uzun Süre Kalıcı Kaliteli Parfümler</title>
        <meta name="description" content="Arjwan Istanbul - En kaliteli esanslarla üretilmiş, uzun süre kalıcı ve etkileyici niş ve tasarımcı muadili parfümler." />
      </Helmet>
      
      {/* Top Image Slider (Hero) */}
      <section className="mb-10">
        {homeBanners.length > 0 ? (
          <BannerSlider banners={homeBanners} bannersMobile={homeBannersMobile} height={bannerHeight} heightMobile={bannerHeightMobile} />
        ) : (
          <div className="w-full aspect-[4/5] md:aspect-[21/9] bg-muted flex items-center justify-center">
            <p className="text-muted-foreground uppercase font-bold tracking-widest text-sm">Arjwan Istanbul</p>
          </div>
        )}
      </section>

      {/* Product Slider 1 */}
      {slider1Products.length > 0 && (
        <section className="py-8 px-4 bg-background">
          <div className="container mx-auto max-w-[1400px]">
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase tracking-tight mb-3">
                {getSliderTitle(1, 'أفضل مبيعاتنا', 'BEST SELLERS', 'EN ÇOK SATANLAR')}
              </h2>
              <div className="w-16 h-1 bg-foreground mx-auto" />
            </div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:overflow-visible" style={{ scrollbarWidth: 'none' }}>
              {slider1Products.map((product, i) => (
                <div key={product.id} className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-auto">
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mid-page Image Slider */}
      {midBanners.length > 0 && (
        <section className="px-4 mb-10">
          <div className="container mx-auto max-w-[1400px]">
            <BannerSlider banners={midBanners} bannersMobile={midBannersMobile} height={bannerHeight} heightMobile={bannerHeightMobile} className="rounded-sm" />
          </div>
        </section>
      )}

      {/* Product Slider 2 */}
      {slider2Products.length > 0 && (
        <section className="py-8 px-4 bg-secondary/50">
          <div className="container mx-auto max-w-[1400px]">
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase tracking-tight mb-3">
                {getSliderTitle(2, 'عطور نسائية', 'WOMEN\'S PERFUMES', 'KADIN PARFÜMLERİ')}
              </h2>
              <div className="w-16 h-1 bg-foreground mx-auto" />
            </div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:overflow-visible" style={{ scrollbarWidth: 'none' }}>
              {slider2Products.map((product, i) => (
                <div key={product.id} className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-auto">
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Slider 3 */}
      {slider3Products.length > 0 && (
        <section className="py-8 px-4 bg-background">
          <div className="container mx-auto max-w-[1400px]">
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase tracking-tight mb-3">
                {getSliderTitle(3, 'عطور رجالية', 'MEN\'S PERFUMES', 'ERKEK PARFÜMLERİ')}
              </h2>
              <div className="w-16 h-1 bg-foreground mx-auto" />
            </div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:overflow-visible" style={{ scrollbarWidth: 'none' }}>
              {slider3Products.map((product, i) => (
                <div key={product.id} className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-auto">
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promotional Banner (Dynamic from Admin Settings) */}
      {(heroTitle || heroSubtitle) && (
        <section className="px-4 py-12 bg-secondary mt-8 mb-20">
          <div className="container mx-auto text-center">
            {heroTitle && (
              <h2 className="text-2xl md:text-4xl font-extrabold text-foreground uppercase tracking-tight mb-4">
                {heroTitle}
              </h2>
            )}
            {heroSubtitle && (
              <p className="text-muted-foreground font-medium max-w-2xl mx-auto mb-8">
                {heroSubtitle}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
