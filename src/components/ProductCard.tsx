import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { Product } from '@/data/products';
import { motion } from 'framer-motion';
import { useOffers, getDiscountForProduct } from '@/hooks/useOffers';

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

  const discountedPrice50 = discount > 0
    ? Math.round(product.price50ml * (1 - discount / 100))
    : null;
  const discountedPrice100 = discount > 0
    ? Math.round(product.price100ml * (1 - discount / 100))
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
          <div className="aspect-[3/4] overflow-hidden bg-[hsl(0_0%_96%)] relative">
            <img
              src={product.image}
              alt={product.name[lang]}
              loading="lazy"
              width={400}
              height={533}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 py-6 px-4"
            />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(270_52%_50%/0.5)] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(43_76%_52%/0.35)] to-transparent" />
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded-sm shadow-lg">
                -{discount}%
              </div>
            )}
          </div>
          <div className="p-5 flex-1 flex flex-col border-t border-[hsl(270_52%_34%/0.3)]">
            <div className="flex items-baseline gap-2 flex-wrap mb-2">
              <h3 className="font-display text-lg text-primary tracking-wider">{product.name[lang]}</h3>
              <span className="text-[10px] text-muted-foreground/50 tracking-widest uppercase shrink-0">{t('brands', 'inspiredBy')}</span>
              <span className="text-sm tracking-wide text-[hsl(270_52%_70%)] font-semibold shrink-0">{product.originalPerfume}</span>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2 flex-1">{product.description[lang]}</p>
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-border/50">
              {discount > 0 ? (
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground/50 text-xs line-through">
                    {product.price50ml} – {product.price100ml} TL
                  </span>
                  <span className="text-[hsl(43_76%_52%)] text-sm font-semibold">
                    {discountedPrice50} – {discountedPrice100} TL
                  </span>
                </div>
              ) : (
                <span className="text-primary text-sm font-medium">
                  {product.price50ml} – {product.price100ml} TL
                </span>
              )}
              <span className="text-xs text-muted-foreground tracking-wider uppercase group-hover:text-primary transition-colors">
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
