import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useOffers, getDiscountForProduct } from '@/hooks/useOffers';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { SHOW_PRICES } from '@/lib/config';
import ProductCard from '@/components/ProductCard';

type Concentration = 'heavy' | 'light';
type Size = '50ml' | '100ml';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const [concentration, setConcentration] = useState<Concentration>('heavy');
  const [size, setSize] = useState<Size>('50ml');
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useProduct(id!);
  const { data: offers = [] } = useOffers();
  const { data: allProducts = [] } = useProducts();

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const discount = getDiscountForProduct(offers, product.id, product.category, product.inspiredBy);
  const originalPrice = size === '50ml' ? product.price50ml : product.price100ml;
  const price = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;

  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.originalPerfume || product.name[lang],
      size,
      concentration,
      quantity,
      price,
      image: product.image,
    });
    toast.success(lang === 'ar' ? 'تمت الإضافة إلى السلة' : lang === 'tr' ? 'Sepete eklendi' : 'Added to cart');
  };

  const concentrations: { key: Concentration; label: string }[] = [
    { key: 'heavy', label: t('products', 'heavy') },
    { key: 'light', label: t('products', 'light') },
  ];

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-5xl">
        <Link to="/perfumes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> {t('nav', 'perfumes')}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[3/4] overflow-hidden rounded-sm border border-[hsl(270_52%_34%/0.4)] bg-[hsl(0_0%_6%)] relative"
          >
            <img src={product.image} alt={product.originalPerfume || product.name[lang]} className="w-full h-full object-cover" width={800} height={1024} />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold tracking-wider px-3 py-1.5 rounded-sm shadow-lg">
                -{discount}% OFF
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-1">Arjwan Istanbul</p>
            <h1 className="font-display text-3xl md:text-4xl text-primary tracking-wider mb-2">{product.originalPerfume || product.name[lang]}</h1>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs text-muted-foreground tracking-widest uppercase">by</span>
              <span className="text-sm tracking-wider text-[hsl(270_52%_65%)] font-medium">Arjwan Istanbul</span>
              {product.inspiredBy && (
                <>
                  <span className="text-xs text-muted-foreground/50">·</span>
                  <span className="text-xs text-muted-foreground border border-[hsl(270_52%_50%/0.3)] px-2 py-0.5 tracking-wider">{product.inspiredBy}</span>
                </>
              )}
            </div>
            <p className="text-foreground/70 leading-relaxed mb-6">{product.description[lang]}</p>

            {/* Notes */}
            <div className="mb-6 space-y-2">
              <h3 className="text-sm text-muted-foreground tracking-wider uppercase">{t('products', 'notes')}</h3>
              <div className="grid grid-cols-3 gap-3">
                {(['top', 'middle', 'base'] as const).map((note) => (
                  <div key={note} className="bg-secondary p-3 rounded-sm">
                    <p className="text-xs text-muted-foreground mb-1">{t('products', `${note}Notes`)}</p>
                    <p className="text-sm text-foreground">{product.notes[note][lang]}</p>
                  </div>
                ))}
              </div>
            </div>



            {/* Size */}
            <div className="mb-5">
              <h3 className="text-sm text-muted-foreground tracking-wider uppercase mb-2">{t('products', 'size')}</h3>
              <div className="flex flex-wrap gap-2">
                {(['50ml', '100ml'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 text-xs tracking-wider border transition-all ${
                      size === s
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:border-primary'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm text-muted-foreground tracking-wider uppercase mb-2">{t('products', 'quantity')}</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 border border-border flex items-center justify-center hover:border-primary transition-colors">
                  <Minus size={14} />
                </button>
                <span className="text-lg w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 border border-border flex items-center justify-center hover:border-primary transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Price + Add to cart */}
            <div className="mt-auto">
              {SHOW_PRICES && (
                discount > 0 ? (
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-muted-foreground/50 line-through text-lg">{originalPrice * quantity} TL</span>
                    <span className="text-2xl text-[hsl(43_76%_52%)] font-display">{price * quantity} TL</span>
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-sm font-bold">-{discount}%</span>
                  </div>
                ) : (
                  <p className="text-2xl text-primary font-display mb-4">{price * quantity} TL</p>
                )
              )}
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-primary-foreground py-4 text-sm tracking-widest uppercase hover:bg-primary/90 transition-all gold-glow flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} />
                {t('products', 'addToCart')}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl text-primary tracking-wider text-center mb-8">
              {lang === 'ar' ? 'قد يعجبك أيضاً' : lang === 'tr' ? 'Bunları da Beğenebilirsiniz' : 'You May Also Like'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;


