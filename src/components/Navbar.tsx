import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Globe, Heart, Search } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTranslation } from '@/i18n/useTranslation';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Language } from '@/i18n/translations';
import { motion, AnimatePresence } from 'framer-motion';

const languages: { code: Language; label: string }[] = [
  { code: 'ar', label: 'AR' },
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.count());
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: t('nav', 'home') },
    { to: '/perfumes', label: t('nav', 'perfumes') },
    { to: '/offers', label: t('nav', 'offers') },
    { to: '/about', label: t('nav', 'aboutUs') },
    { to: '/contact', label: t('nav', 'contact') },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-muted border-b border-border text-foreground text-[11px] md:text-xs font-semibold tracking-wider uppercase py-2 px-4 text-center">
        {lang === 'ar' ? 'شحن مجاني للطلبات فوق 600 ليرة!' : lang === 'tr' ? '600 TL ÜZERİ ÜCRETSİZ KARGO!' : 'FREE SHIPPING OVER 600 TL!'}
      </div>

      <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Left side: Hamburger (Mobile) + Search (Desktop) */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-foreground hover:text-foreground/70 transition-colors"
                aria-label="Menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="hidden md:flex items-center gap-6">
                <button className="text-foreground hover:text-foreground/70 transition-colors">
                  <Search size={22} />
                </button>
              </div>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/" className="flex items-center">
                <img
                  src="/arjwan_logo_transparent.png"
                  alt="Arjwan Istanbul"
                  className="h-10 md:h-14 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Right side: Lang + Wishlist + Cart */}
            <div className="flex items-center justify-end gap-4 md:gap-5 flex-1">
              {/* Language switcher */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1 text-foreground font-medium hover:text-foreground/70 transition-colors text-sm uppercase"
                >
                  {lang}
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full mt-4 end-0 bg-background border border-border shadow-xl w-24 overflow-hidden z-50"
                    >
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { setLang(l.code); setLangOpen(false); }}
                          className={`block w-full px-4 py-2.5 text-sm text-start hover:bg-muted font-medium transition-colors ${
                            lang === l.code ? 'text-foreground font-bold' : 'text-foreground/70'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative text-foreground hover:text-foreground/70 transition-colors">
                <Heart size={22} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -end-2 bg-foreground text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative text-foreground hover:text-foreground/70 transition-colors">
                <ShoppingBag size={22} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -end-2 bg-foreground text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Bottom Nav Links */}
        <div className="hidden md:flex items-center justify-center gap-8 h-12 bg-background border-t border-border">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-semibold tracking-wider uppercase transition-colors hover:text-foreground/70 ${
                location.pathname === link.to
                  ? 'text-foreground'
                  : 'text-foreground/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-[104px] bg-black/60 backdrop-blur-sm md:hidden"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-[104px] bottom-0 start-0 w-[80%] bg-background border-e border-border md:hidden z-50 overflow-y-auto"
              >
                <div className="p-4">
                  {/* Language switch inside mobile menu */}
                  <div className="flex items-center gap-2 mb-6 bg-muted p-2 rounded-sm">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className={`flex-1 py-2 text-sm font-bold transition-colors ${
                          lang === l.code ? 'bg-background shadow-sm text-foreground' : 'text-foreground/50 hover:text-foreground'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`py-4 px-2 text-base font-bold tracking-wider uppercase transition-colors border-b border-border ${
                          location.pathname === link.to ? 'text-foreground' : 'text-foreground/70'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
