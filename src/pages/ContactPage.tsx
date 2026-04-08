import { useTranslation } from '@/i18n/useTranslation';
import { motion } from 'framer-motion';
import { MessageCircle, Instagram } from 'lucide-react';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-16 min-h-screen px-4 flex items-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(270_52%_34%/0.05)] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="container mx-auto max-w-lg relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">

          <p className="font-arabic text-primary/60 text-lg mb-2">تواصل معنا</p>
          <h1 className="font-display text-3xl md:text-4xl text-primary tracking-wider mb-3">{t('contact', 'title')}</h1>
          <p className="text-muted-foreground text-sm mb-10 tracking-wide">
            We're here to help you find your signature scent
          </p>

          <div className="space-y-3">
            <a
              href="https://wa.me/905000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-card border border-[hsl(270_52%_34%/0.5)] hover:border-primary text-foreground py-4 text-sm tracking-widest uppercase hover:bg-card/80 transition-all duration-300 flex items-center justify-center gap-3 rounded-sm group"
            >
              <span className="w-2 h-2 rounded-full bg-[#25D366] group-hover:shadow-[0_0_8px_#25D366] transition-shadow" />
              <MessageCircle size={18} className="text-primary" />
              <span>{t('contact', 'whatsapp')}</span>
            </a>

            <div className="flex items-center gap-4 py-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="w-1.5 h-1.5 rotate-45 border border-primary/40" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <p className="text-muted-foreground text-sm mb-4 tracking-widest uppercase">{t('contact', 'followUs')}</p>
            <div className="flex justify-center gap-8">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-12 h-12 border border-border group-hover:border-primary/50 rounded-sm flex items-center justify-center transition-all group-hover:bg-primary/5">
                  <Instagram size={22} />
                </div>
                <span className="text-xs tracking-widest">INSTAGRAM</span>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-12 h-12 border border-border group-hover:border-primary/50 rounded-sm flex items-center justify-center transition-all group-hover:bg-primary/5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.11v-3.51a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15.2 6.34 6.34 0 0 0 9.49 21.54a6.34 6.34 0 0 0 6.34-6.34V8.72a8.27 8.27 0 0 0 3.76.94V6.23a4.85 4.85 0 0 1-3.76.46Z"/></svg>
                </div>
                <span className="text-xs tracking-widest">TIKTOK</span>
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[hsl(270_52%_34%/0.25)]">
            <p className="text-xs text-muted-foreground/50 tracking-widest uppercase">Made in Istanbul · Shipped Worldwide</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
