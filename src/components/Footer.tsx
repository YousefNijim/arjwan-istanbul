import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { ShieldCheck, Truck, Star } from 'lucide-react';

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const Footer = () => {
  const { t, lang } = useTranslation();

  return (
    <footer className="bg-card border-t border-[hsl(270_52%_34%/0.35)]">
      {/* Trust badges row */}
      <div className="border-b border-[hsl(270_52%_34%/0.2)]">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck size={16} className="text-primary" />
              <span>{lang === 'ar' ? 'ضمان الأصالة' : lang === 'tr' ? 'Özgünlük Garantisi' : 'Authenticity Guaranteed'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck size={16} className="text-primary" />
              <span>{lang === 'ar' ? 'شحن سريع لتركيا' : lang === 'tr' ? 'Türkiye Geneli Hızlı Teslimat' : 'Fast Shipping Across Turkey'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star size={16} className="text-primary" />
              <span>{lang === 'ar' ? 'زيوت إسبانية عالية الجودة' : lang === 'tr' ? 'İspanyol Kalite Yağları' : 'Spanish Grade Oils'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div className="text-center md:text-start">
            <Link to="/" className="inline-block">
              <span className="text-primary font-display text-xl tracking-[0.3em]">ARJWAN</span>
              <p className="text-foreground/40 text-xs tracking-[0.5em] uppercase">Istanbul</p>
            </Link>
            <p className="text-muted-foreground text-sm mt-3">أرجوان إسطنبول</p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-2">
            <Link to="/perfumes" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav', 'perfumes')}</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav', 'aboutUs')}</Link>
            <Link to="/about-oils" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav', 'aboutOils')}</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav', 'contact')}</Link>
            <Link to="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {lang === 'ar' ? 'الشحن والتوصيل' : lang === 'tr' ? 'Kargo ve Teslimat' : 'Shipping & Delivery'}
            </Link>
            <Link to="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {lang === 'ar' ? 'سياسة الإرجاع' : lang === 'tr' ? 'İade Politikası' : 'Returns Policy'}
            </Link>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <p className="text-sm text-muted-foreground">{t('contact', 'followUs')}</p>
            <div className="flex gap-4">
              <a href="https://instagram.com/arjwan.istanbul" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <InstagramIcon size={20} />
              </a>
              <a href="https://www.tiktok.com/@arjwan.istanbul" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.11v-3.51a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15.2 6.34 6.34 0 0 0 9.49 21.54a6.34 6.34 0 0 0 6.34-6.34V8.72a8.27 8.27 0 0 0 3.76.94V6.23a4.85 4.85 0 0 1-3.76.46Z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 Arjwan Istanbul. {t('footer', 'rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

