import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';

const BADGE_STYLES: Record<string, string> = {
  gold: 'bg-[hsl(43_76%_52%)] text-black',
  red: 'bg-red-500 text-white',
};

const Placeholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-[hsl(270_52%_8%)]">
    <img src="/bottle-gold.png" alt="" className="h-32 object-contain opacity-40" />
  </div>
);

const OffersPage = () => {
  const { data: siteSettings } = useSettings();
  const bundles: any[] = Array.isArray(siteSettings?.bundles) ? siteSettings.bundles : [];

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-3xl">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-[hsl(43_76%_52%)] text-xs tracking-[0.5em] uppercase mb-3">
            Limited Time
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wider mb-4">
            Exclusive Offers
          </h1>
          <p className="text-muted-foreground">
            Curated bundles crafted for gifting
          </p>
        </motion.div>

        {bundles.length === 0 ? (
          <p className="text-center text-muted-foreground/50 py-16">No offers available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bundles.map((bundle, index) => (
              <motion.div
                key={bundle.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Link to={bundle.path || '#'} className="group block h-full">
                  <div className="rounded-sm overflow-hidden bg-card border border-[hsl(270_52%_34%/0.45)] hover:border-[hsl(43_76%_52%/0.45)] transition-all duration-500 hover:shadow-[0_0_30px_hsl(270_52%_34%/0.2)] h-full flex flex-col">
                    <div className="aspect-[3/4] overflow-hidden bg-[hsl(0_0%_6%)] relative">
                      {bundle.image
                        ? <img src={bundle.image} alt={bundle.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        : <Placeholder />
                      }
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(270_52%_50%/0.5)] to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(43_76%_52%/0.35)] to-transparent" />
                      {bundle.badge && (
                        <span className={`absolute top-3 start-3 text-[10px] tracking-[0.3em] uppercase px-2.5 py-1 ${BADGE_STYLES[bundle.badgeStyle] || BADGE_STYLES.gold}`}>
                          {bundle.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col border-t border-[hsl(270_52%_34%/0.3)]">
                      <h3 className="font-display text-lg text-primary tracking-wider mb-1">{bundle.name}</h3>
                      {bundle.items && (
                        <p className="text-xs text-muted-foreground/60 tracking-widest uppercase mb-2">{bundle.items}</p>
                      )}
                      <p className="text-muted-foreground text-sm line-clamp-2 flex-1">{bundle.desc}</p>
                      <div className="mt-3 flex items-center justify-between pt-3 border-t border-border/50">
                        {bundle.price && (
                          <span className="text-[hsl(43_76%_52%)] text-sm font-semibold">₺{bundle.price}</span>
                        )}
                        <span className="text-xs text-muted-foreground tracking-wider uppercase group-hover:text-primary transition-colors ms-auto">
                          View Bundle →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default OffersPage;
