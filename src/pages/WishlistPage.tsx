import { useTranslation } from '@/i18n/useTranslation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { t, lang } = useTranslation();
  const { ids } = useWishlistStore();
  const { data: allProducts = [] } = useProducts();

  const wishlisted = allProducts.filter((p) => ids.includes(p.id));

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Heart className="text-primary mx-auto mb-4" size={32} />
          <h1 className="font-display text-3xl md:text-4xl text-primary tracking-wider">
            {lang === 'ar' ? 'المفضلة' : lang === 'tr' ? 'Favoriler' : 'Wishlist'}
          </h1>
        </motion.div>

        {wishlisted.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full border border-border flex items-center justify-center mx-auto mb-6">
              <Heart size={36} className="text-muted-foreground" />
            </div>
            <p className="font-display text-2xl text-primary tracking-wider mb-3">
              {lang === 'ar'
                ? 'قائمة المفضلة فارغة'
                : lang === 'tr'
                  ? 'Favoriler boş'
                  : 'Your wishlist is empty'}
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              {lang === 'ar'
                ? 'أضف عطورك المفضلة لتجدها هنا لاحقاً'
                : lang === 'tr'
                  ? 'Beğendiğiniz parfümleri favorilere ekleyin'
                  : 'Save perfumes you love to find them here later'}
            </p>
            <Link
              to="/perfumes"
              className="inline-flex items-center gap-2 border border-primary text-primary px-10 py-3 text-xs tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ShoppingBag size={15} />
              {t('cart', 'continueShopping')}
            </Link>
          </motion.div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground/50 mb-6 tracking-wider text-center">
              {wishlisted.length}{' '}
              {lang === 'ar' ? 'عطر محفوظ' : lang === 'tr' ? 'parfüm kaydedildi' : 'saved perfumes'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlisted.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
