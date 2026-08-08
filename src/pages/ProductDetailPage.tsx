import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useOffers, getDiscountForProduct } from '@/hooks/useOffers';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, ShoppingBag, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { SHOW_PRICES } from '@/lib/config';
import ProductCard from '@/components/ProductCard';
import { Helmet } from 'react-helmet-async';

type Concentration = 'heavy' | 'light';
type Size = '50ml' | '100ml';

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between py-4 text-left font-bold tracking-tight text-sm uppercase text-foreground hover:text-foreground/70 transition-colors"
      >
        {title}
        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm text-muted-foreground leading-relaxed font-medium">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const [concentration, setConcentration] = useState<Concentration>('heavy');
  const [size, setSize] = useState<Size>('50ml');
  const [quantity, setQuantity] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const newActive = Math.round(scrollLeft / width);
    setActiveImage(newActive);
  };

  const { data: product, isLoading } = useProduct(id!);
  const { data: offers = [] } = useOffers();
  const { data: allProducts = [] } = useProducts();

  if (isLoading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Loading…</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Product not found</p>
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

  const allImages = [product.image, ...(product.additionalImages || [])];
  
  const pageTitle = `${product.originalPerfume || product.name[lang]} | Arjwan Istanbul`;
  const pageDesc = product.description[lang].substring(0, 160);

  return (
    <div className="pt-0 md:pt-10 pb-32 md:pb-24 bg-background min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={product.image} />
      </Helmet>

      <div className="container mx-auto max-w-6xl md:px-4">
        
        {/* Breadcrumb - Desktop Only */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">HOME</Link>
          <span>/</span>
          <Link to="/perfumes" className="hover:text-foreground transition-colors">PERFUMES</Link>
          <span>/</span>
          <span className="text-foreground">{product.originalPerfume || product.name[lang]}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-0 md:gap-12 lg:gap-16">
          {/* Images (Mobile full width swipeable, Desktop grid) */}
          <div className="w-full md:w-1/2 relative">
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-4 md:overflow-visible" 
              style={{ scrollbarWidth: 'none' }}
            >
              {allImages.map((img, idx) => (
                <div key={idx} className={`snap-center shrink-0 w-full md:w-auto aspect-[4/5] bg-secondary relative flex items-center justify-center p-8 md:rounded-sm ${idx === 0 ? 'md:col-span-2' : ''}`}>
                  <img src={img} alt={`${product.originalPerfume || product.name[lang]} - ${idx+1}`} className="w-full h-full object-contain mix-blend-multiply" />
                  {idx === 0 && discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs md:text-sm font-bold tracking-wider px-3 py-1.5 uppercase rounded-sm shadow-md">
                      % {discount} {lang === 'ar' ? 'خصم' : lang === 'tr' ? 'İNDİRİM' : 'OFF'}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Mobile Pagination Dots */}
            {allImages.length > 1 && (
              <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                {allImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeImage === idx ? 'bg-foreground w-4' : 'bg-foreground/20 w-1.5'}`} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col w-full md:w-1/2 px-4 md:px-0 pt-6 md:pt-0">
            <p className="text-muted-foreground text-xs md:text-sm font-bold tracking-widest uppercase mb-2">Arjwan Istanbul</p>
            <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight uppercase mb-4 leading-none">
              {product.originalPerfume || product.name[lang]}
            </h1>
            
            <div className="mb-6">
              <span className="inline-block bg-secondary border border-border px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-sm text-foreground">
                {product.category === 'men' ? 'ERKEK PARFÜM' : 'KADIN PARFÜM'}
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              {SHOW_PRICES && (
                discount > 0 ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl md:text-4xl font-extrabold text-foreground">{price * quantity} TL</span>
                    <span className="text-lg md:text-xl text-muted-foreground line-through font-medium mt-1">{originalPrice * quantity} TL</span>
                  </div>
                ) : (
                  <p className="text-3xl md:text-4xl font-extrabold text-foreground">{price * quantity} TL</p>
                )
              )}
            </div>
            
            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm text-foreground font-bold tracking-tight uppercase">{lang === 'ar' ? 'الحجم' : lang === 'tr' ? 'Hacim' : 'Size'}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {(['50ml', '100ml'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 py-3 text-sm font-bold tracking-wider border rounded-sm transition-all uppercase ${
                      size === s
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-white border-border text-foreground hover:border-foreground/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex flex-col gap-3 mb-10">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center justify-between border border-border bg-white rounded-sm h-[56px] w-32 px-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-foreground hover:bg-secondary transition-colors font-bold"><Minus size={16} /></button>
                  <span className="text-base font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-foreground hover:bg-secondary transition-colors font-bold"><Plus size={16} /></button>
                </div>
                
                {/* Desktop Buy Button */}
                <button
                  onClick={handleAddToCart}
                  className="hidden md:flex flex-1 h-[56px] bg-foreground text-background text-sm font-bold tracking-widest uppercase hover:bg-foreground/90 transition-all items-center justify-center gap-2 rounded-sm"
                >
                  <ShoppingBag size={18} />
                  {lang === 'ar' ? 'أضف للسلة' : lang === 'tr' ? 'SEPETE EKLE' : 'ADD TO CART'}
                </button>
              </div>

              {/* Mobile Buy Button */}
              <button
                onClick={handleAddToCart}
                className="md:hidden w-full h-[56px] bg-foreground text-background text-sm font-bold tracking-widest uppercase hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 rounded-sm shadow-lg shadow-black/10"
              >
                <ShoppingBag size={18} />
                {lang === 'ar' ? 'أضف للسلة' : lang === 'tr' ? 'SEPETE EKLE' : 'ADD TO CART'}
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-border">
              <AccordionItem title={lang === 'ar' ? 'الوصف' : lang === 'tr' ? 'Ürün Açıklaması' : 'Description'} defaultOpen>
                {product.description[lang]}
              </AccordionItem>
              
              <AccordionItem title={lang === 'ar' ? 'المكونات العطرية' : lang === 'tr' ? 'Koku Notaları' : 'Fragrance Notes'}>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-[100px_1fr] items-baseline gap-2">
                    <span className="text-xs font-bold uppercase text-foreground">{t('products', 'topNotes')}:</span>
                    <span className="text-sm text-muted-foreground">{product.notes.top[lang]}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-baseline gap-2">
                    <span className="text-xs font-bold uppercase text-foreground">{t('products', 'middleNotes')}:</span>
                    <span className="text-sm text-muted-foreground">{product.notes.middle[lang]}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-baseline gap-2">
                    <span className="text-xs font-bold uppercase text-foreground">{t('products', 'baseNotes')}:</span>
                    <span className="text-sm text-muted-foreground">{product.notes.base[lang]}</span>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title={lang === 'ar' ? 'الاستخدام' : lang === 'tr' ? 'Kullanım Önerisi' : 'How to Use'}>
                {lang === 'ar' 
                  ? 'يُرش العطر على أماكن النبض: العنق، والصدر، والمعصمين. تجنب فركه بعد الرش للحفاظ على ثبات المكونات العطرية.'
                  : lang === 'tr'
                  ? 'Temiz tene veya kıyafete istenilen sıklıkta uygulanır. Kalıcılığı artırmak için nabız noktalarına (bilek içleri, boyun) sıkılması önerilir.'
                  : 'Apply to clean skin or clothing as often as desired. To increase longevity, it is recommended to spray on pulse points (inner wrists, neck).'}
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 md:mt-32 px-4 md:px-0">
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground uppercase tracking-tight text-center mb-8">
              {lang === 'ar' ? 'قد يعجبك أيضاً' : lang === 'tr' ? 'BUNLARI DA BEĞENEBİLİRSİNİZ' : 'YOU MAY ALSO LIKE'}
            </h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible" style={{ scrollbarWidth: 'none' }}>
              {related.map((p, i) => (
                <div key={p.id} className="snap-center shrink-0 w-[80%] sm:w-[60%] md:w-auto">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
