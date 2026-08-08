import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { Product } from '@/data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { useOffers, getDiscountForProduct } from '@/hooks/useOffers';
import { useWishlistStore } from '@/store/wishlistStore';
import { Heart } from 'lucide-react';
import { SHOW_PRICES } from '@/lib/config';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { t, lang } = useTranslation();
  const { data: offers = [] } = useOffers();

  const discount = getDiscountForProduct(
    offers,
    product.id,
    product.category,
    product.inspiredBy,
  );

  const { toggle, has } = useWishlistStore();
  const inWishlist = has(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const adding = !inWishlist;
    toggle(product.id);
    if (adding) {
      toast.success(
        lang === 'ar' ? 'تمت الإضافة إلى المفضلة ❤️' :
        lang === 'tr' ? 'Favorilere eklendi ❤️' :
        'Added to wishlist ❤️',
        { duration: 1800 }
      );
    } else {
      toast(
        lang === 'ar' ? 'تمت الإزالة من المفضلة' :
        lang === 'tr' ? 'Favorilerden kaldırıldı' :
        'Removed from wishlist',
        { duration: 1500 }
      );
    }
  };

  const discountedPrice50 = discount > 0
    ? Math.round(product.price50ml * (1 - discount / 100))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link to={`/perfumes/${product.id}`} className="group block h-full">
        <div className="rounded-sm overflow-hidden bg-card border border-[hsl(270_52%_34%/0.45)] hover:border-[hsl(43_76%_52%/0.45)] transition-all duration-500 hover:shadow-[0_0_30px_hsl(270_52%_34%/0.2)] h-full flex flex-col">
          <div className="aspect-[3/4] overflow-hidden bg-[hsl(0_0%_6%)] relative">
            <img
              src={product.image}
              alt={product.originalPerfume || product.name[lang]}
              loading="lazy"
              width={400}
              height={533}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(270_52%_50%/0.5)] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(43_76%_52%/0.35)] to-transparent" />

            {/* Wishlist button — always visible, prominent */}
            <motion.button
              onClick={handleWishlist}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              whileTap={{ scale: 0.85 }}
              className={`absolute top-3 end-3 w-9 h-9 rounded-full flex items-center justify-center z-10 shadow-md transition-all duration-200 ${
                inWishlist
                  ? 'bg-primary/90 backdrop-blur-sm'
                  : 'bg-background/75 backdrop-blur-sm hover:bg-background/95'
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={inWishlist ? 'filled' : 'empty'}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Heart
                    size={16}
                    className={inWishlist ? 'fill-primary-foreground text-primary-foreground' : 'text-foreground/80'}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded-sm shadow-lg">
                -{discount}%
              </div>
            )}
          </div>
          <div className="p-5 flex-1 flex flex-col border-t border-[hsl(270_52%_34%/0.3)]">
            <div className="flex flex-col gap-0.5 mb-2">
              <h3 className="font-display text-lg text-primary tracking-wider">{product.originalPerfume || product.name[lang]}</h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-muted-foreground/70 tracking-widest uppercase">by Arjwan Istanbul</span>
                {product.inspiredBy && (
                  <span className="text-[10px] text-muted-foreground/60 border border-[hsl(270_52%_50%/0.25)] px-1.5 py-0.5 tracking-wider">{product.inspiredBy}</span>
                )}
              </div>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2 flex-1">{product.description[lang]}</p>
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-border/50">
              {SHOW_PRICES && (
                discount > 0 ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted-foreground/50 text-xs line-through">
                      {product.price50ml} TL
                    </span>
                    <span className="text-[hsl(43_76%_52%)] text-sm font-semibold">
                      {discountedPrice50} TL
                    </span>
                  </div>
                ) : (
                  <span className="text-primary text-sm font-medium">
                    {product.price50ml} TL
                  </span>
                )
              )}
              <span className="text-xs text-muted-foreground tracking-wider uppercase group-hover:text-primary transition-colors ms-auto">
                {t('products', 'viewDetails')} →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
