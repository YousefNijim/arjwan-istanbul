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

const heroImages = [hero1, hero2];

const Index = () => {
  const { t, lang } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const { data: allProducts = [] } = useProducts();
  const featured = allProducts.filter((p) => p.featured);

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
              className="h-40 md:h-56 lg:h-64 w-auto object-contain mx-auto mb-8 drop-shadow-2xl"
            />
            <p className="text-foreground/70 text-lg md:text-xl max-w-md mx-auto mb-10 font-body">
              {t('hero', 'tagline')}
            </p>
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
