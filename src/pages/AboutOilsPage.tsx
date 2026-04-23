import { useTranslation } from '@/i18n/useTranslation';
import { motion } from 'framer-motion';
import { Droplets, Sparkles } from 'lucide-react';

const AboutOilsPage = () => {
  const { t } = useTranslation();

  const concentrations = [
    { icon: Sparkles, title: t('products', 'heavy'), desc: t('aboutOils', 'heavyDesc') },
    { icon: Droplets, title: t('products', 'light'), desc: t('aboutOils', 'lightDesc') },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl text-center text-primary tracking-wider mb-12">
            {t('aboutOils', 'title')}
          </h1>

          {/* Quality */}
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl text-primary tracking-wider mb-4">{t('aboutOils', 'qualityTitle')}</h2>
            <p className="text-foreground/70 leading-relaxed text-lg">{t('aboutOils', 'qualityText')}</p>
          </div>

          <div className="w-16 h-px bg-primary mx-auto mb-16" />

          {/* Concentrations */}
          <h2 className="font-display text-2xl text-center text-primary tracking-wider mb-8">
            {t('aboutOils', 'concentrationTitle')}
          </h2>
          <div className="space-y-6">
            {concentrations.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-sm bg-card p-6 flex items-start gap-4 border border-[hsl(270_52%_34%/0.4)] hover:border-[hsl(270_52%_34%/0.7)] transition-colors"
              >
                <item.icon size={24} className="text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="text-primary font-display tracking-wider mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutOilsPage;
