import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { Product } from '@/data/products';
import { useOffers, getDiscountForProduct } from '@/hooks/useOffers';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { SHOW_PRICES } from '@/lib/config';
import { toast } from 'sonner';

interface Props {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: Props) => {
  const { lang, t } = useTranslation();
  const { data: offers = [] } = useOffers();
  const { toggle, has } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  
  const discount = getDiscountForProduct(offers, product.id, product.category, product.inspiredBy);
  const isWishlisted = has(product.id);

  // Default to 50ml price for display
  const price = discount > 0 
    ? Math.round(product.price50ml * (1 - discount / 100))
    : product.price50ml;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.originalPerfume || product.name[lang],
      size: '50ml',
      concentration: 'heavy',
      quantity: 1,
      price: price,
      image: product.image,
    });
    toast.success(lang === 'ar' ? 'تمت الإضافة إلى السلة' : lang === 'tr' ? 'Sepete eklendi' : 'Added to cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link to={`/perfumes/${product.id}`} className="group block h-full bg-white border border-border hover:border-foreground/20 transition-all duration-300 rounded-sm overflow-hidden flex flex-col relative shadow-sm hover:shadow-md">
        
        {/* Image Container */}
        <div className="aspect-[4/5] bg-secondary relative overflow-hidden p-4 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.originalPerfume || product.name[lang]}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] md:text-xs font-bold tracking-wider px-2 py-1 uppercase rounded-sm">
              % {discount} {lang === 'ar' ? 'خصم' : lang === 'tr' ? 'İNDİRİM' : 'OFF'}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => { e.preventDefault(); toggle(product.id); }}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-foreground shadow-sm transition-colors"
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-red-500' : ''} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col text-center">
          <h3 className="font-bold text-sm md:text-base text-foreground mb-1 uppercase tracking-tight line-clamp-1">
            {product.originalPerfume || product.name[lang]}
          </h3>
          <p className="text-xs text-muted-foreground font-medium mb-3 line-clamp-1 uppercase tracking-wider">
            {product.inspiredBy ? `${product.inspiredBy} MUADİLİ` : 'ARJWAN ISTANBUL'}
          </p>
          
          <div className="mt-auto">
            {SHOW_PRICES && (
              <div className="flex flex-col items-center justify-center gap-1 mb-4">
                {discount > 0 ? (
                  <>
                    <span className="text-xs text-muted-foreground line-through font-medium">{product.price50ml} TL</span>
                    <span className="text-lg md:text-xl font-extrabold text-foreground">{price} TL</span>
                  </>
                ) : (
                  <span className="text-lg md:text-xl font-extrabold text-foreground">{product.price50ml} TL</span>
                )}
              </div>
            )}
            
            <button
              onClick={handleAddToCart}
              className="w-full bg-foreground text-background py-2.5 text-xs md:text-sm font-bold tracking-widest uppercase hover:bg-foreground/80 transition-colors flex items-center justify-center gap-2 rounded-sm"
            >
              <ShoppingBag size={16} />
              {lang === 'ar' ? 'أضف للسلة' : lang === 'tr' ? 'SEPETE EKLE' : 'ADD TO CART'}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
