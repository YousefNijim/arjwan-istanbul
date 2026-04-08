import { useTranslation } from '@/i18n/useTranslation';
import { motion } from 'framer-motion';
import hero2 from '@/assets/hero-2.jpg';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={hero2} alt="About" className="w-full h-full object-cover" loading="lazy" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-display text-4xl text-primary tracking-wider">{t('about', 'title')}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-3xl py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          {/* Brand Story */}
          <div className="text-center">
            <h2 className="font-display text-2xl text-primary tracking-wider mb-4">{t('sections', 'brandStoryTitle')}</h2>
            <p className="text-foreground/70 leading-relaxed text-lg">{t('sections', 'brandStoryText')}</p>
          </div>

          <div className="w-16 h-px bg-primary mx-auto" />

          {/* Vision */}
          <div className="text-center">
            <h2 className="font-display text-2xl text-primary tracking-wider mb-4">{t('about', 'vision')}</h2>
            <p className="text-foreground/70 leading-relaxed text-lg">{t('about', 'visionText')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
