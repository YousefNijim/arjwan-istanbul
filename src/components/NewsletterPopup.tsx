import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

const STORAGE_KEY = 'arjwan-newsletter-shown';

const NewsletterPopup = () => {
  const { t, lang } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, '1');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    localStorage.setItem(STORAGE_KEY, '1');
    setTimeout(() => setVisible(false), 2500);
  };

  const isRtl = lang === 'ar';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed bottom-24 end-6 z-50 w-[320px] bg-card border border-[hsl(270_52%_34%/0.5)] rounded-sm shadow-2xl shadow-black/40 overflow-hidden"
        >
          {/* Gradient bar */}
          <div className="h-[2px] w-full bg-gradient-to-r from-[hsl(270_52%_50%)] via-[hsl(43_76%_52%)] to-[hsl(270_52%_50%)]" />

          <div className="p-5">
            {/* Dismiss */}
            <button
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-3 end-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <X size={16} />
            </button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <Sparkles className="text-primary mx-auto mb-3" size={32} />
                <p className="font-display text-primary text-lg tracking-wider mb-1">
                  {lang === 'ar' ? 'شكراً لك!' : lang === 'tr' ? 'Teşekkürler!' : 'Thank You!'}
                </p>
                <p className="text-muted-foreground text-sm">
                  {lang === 'ar'
                    ? 'سنرسل لك أحدث العروض قريباً'
                    : lang === 'tr'
                    ? 'En son teklifleri yakında göndereceğiz'
                    : "We'll send you the latest offers soon"}
                </p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Mail size={16} className="text-primary" />
                  <h3 className="font-display text-primary tracking-wider text-base">
                    {t('sections', 'newsletter')}
                  </h3>
                </div>
                <p className="text-muted-foreground text-xs mb-4 leading-relaxed">
                  {lang === 'ar'
                    ? 'اشترك الآن واحصل على 10% خصم على طلبك الأول'
                    : lang === 'tr'
                    ? 'Şimdi abone ol, ilk siparişinde %10 indirim kazan'
                    : 'Subscribe now and get 10% off your first order'}
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('sections', 'email')}
                    required
                    className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors rounded-sm"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-2.5 text-xs tracking-widest uppercase hover:bg-primary/90 transition-all rounded-sm font-medium"
                  >
                    {t('sections', 'subscribe')}
                  </button>
                </form>
                <button
                  onClick={dismiss}
                  className="mt-3 w-full text-center text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  {lang === 'ar' ? 'لا شكراً' : lang === 'tr' ? 'Hayır, teşekkürler' : 'No thanks'}
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
