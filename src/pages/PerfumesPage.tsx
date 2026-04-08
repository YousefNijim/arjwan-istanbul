import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { brands } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menBrands = brands.filter((b) => b.gender === 'men' || b.gender === 'both');
const womenBrands = brands.filter((b) => b.gender === 'women' || b.gender === 'both');

const PerfumesPage = () => {
  const { t, lang } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menExpanded, setMenExpanded] = useState(true);
  const [womenExpanded, setWomenExpanded] = useState(true);
  const category = searchParams.get('category') || 'all';
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = category === 'all' || p.category === category;
      const matchBrand = !selectedBrand || p.inspiredBy === selectedBrand;
      const q = search.toLowerCase();
      const matchSearch = !search
        || p.name[lang].toLowerCase().includes(q)
        || p.originalPerfume.toLowerCase().includes(q)
        || p.inspiredBy.toLowerCase().includes(q);
      return matchCategory && matchBrand && matchSearch;
    });
  }, [category, search, lang, selectedBrand, products]);

  const getBrandCount = (brandName: string) => {
    return products.filter((p) => {
      const matchCategory = category === 'all' || p.category === category;
      return matchCategory && p.inspiredBy === brandName;
    }).length;
  };

  const totalForCategory = useMemo(() => {
    return products.filter((p) => category === 'all' || p.category === category).length;
  }, [category, products]);

  const setCategory = (cat: string) => {
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
    setSelectedBrand(null);
  };

  const handleBrandSelect = (brand: string | null) => {
    setSelectedBrand(brand);
    setSidebarOpen(false);
  };

  const BrandList = ({ list, label, isMen }: { list: typeof brands; label: string; isMen: boolean }) => {
    const isExpanded = isMen ? menExpanded : womenExpanded;
    const toggle = () => isMen ? setMenExpanded(!menExpanded) : setWomenExpanded(!womenExpanded);

    const activeBrands = list.filter((b) => getBrandCount(b.name) > 0);
    const inactiveBrands = list.filter((b) => getBrandCount(b.name) === 0);

    return (
      <div>
        <button
          onClick={toggle}
          className="w-full flex items-center justify-between py-2 mb-1"
        >
          <span className="text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase font-medium">
            {label}
          </span>
          {isExpanded
            ? <ChevronUp size={12} className="text-muted-foreground/40" />
            : <ChevronDown size={12} className="text-muted-foreground/40" />
          }
        </button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-0.5 mb-4">
                {activeBrands.map((brand) => {
                  const count = getBrandCount(brand.name);
                  const isActive = selectedBrand === brand.name;
                  return (
                    <button
                      key={brand.name}
                      onClick={() => handleBrandSelect(isActive ? null : brand.name)}
                      className={`group w-full text-start px-3 py-2 text-sm rounded-sm transition-all duration-200 flex items-center justify-between ${
                        isActive
                          ? 'bg-[hsl(270_52%_34%/0.3)] border border-[hsl(270_52%_50%/0.5)] text-primary'
                          : 'hover:bg-[hsl(270_52%_34%/0.15)] text-foreground/80 hover:text-primary border border-transparent'
                      }`}
                    >
                      <span className="truncate">{brand.name}</span>
                      <span className={`text-[11px] ml-1 shrink-0 px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
                {inactiveBrands.map((brand) => (
                  <div
                    key={brand.name}
                    className="w-full text-start px-3 py-2 text-sm rounded-sm flex items-center justify-between opacity-30 cursor-not-allowed"
                  >
                    <span className="truncate text-foreground/50">{brand.name}</span>
                    <span className="text-[11px] ml-1 shrink-0 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground/50">0</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 mb-0.5">{t('brands', 'filterBy')}</p>
          <h3 className="font-display text-base text-primary tracking-wide">{t('brands', 'inspiration')}</h3>
        </div>
        {selectedBrand && (
          <button
            onClick={() => setSelectedBrand(null)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <X size={12} />
            {t('brands', 'clear')}
          </button>
        )}
      </div>

      <button
        onClick={() => handleBrandSelect(null)}
        className={`w-full text-start px-3 py-2 text-sm rounded-sm transition-all duration-200 flex items-center justify-between mb-4 border ${
          !selectedBrand
            ? 'bg-primary text-primary-foreground border-primary'
            : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
        }`}
      >
        <span>{t('brands', 'allBrands')}</span>
        <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
          !selectedBrand ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          {totalForCategory}
        </span>
      </button>

      <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 scrollbar-thin">
        <div className="border-t border-[hsl(270_52%_34%/0.25)] pt-3">
          <BrandList list={menBrands} label={t('brands', 'forMen')} isMen={true} />
        </div>
        <div className="border-t border-[hsl(270_52%_34%/0.25)] pt-3">
          <BrandList list={womenBrands} label={t('brands', 'forWomen')} isMen={false} />
        </div>
      </div>

      {selectedBrand && (
        <div className="mt-4 pt-4 border-t border-[hsl(270_52%_34%/0.25)]">
          <p className="text-[10px] text-muted-foreground/50 tracking-widest uppercase mb-1">{t('brands', 'selected')}</p>
          <p className="text-sm text-primary font-display">{selectedBrand}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {brands.find(b => b.name === selectedBrand)?.signature}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl text-center text-primary tracking-wider mb-8"
        >
          {t('nav', 'perfumes')}
        </motion.h1>

        {/* Top filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm tracking-wider border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all"
            >
              <SlidersHorizontal size={15} />
              {t('brands', 'brandsBtn')}
              {selectedBrand && (
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              )}
            </button>

            {['all', 'men', 'women'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 text-sm tracking-wider transition-all border ${
                  category === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {cat === 'all' ? t('products', 'filterAll') : t('sections', cat)}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 flex items-center gap-2">
            {selectedBrand && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-primary border border-[hsl(270_52%_50%/0.4)] px-2 py-1 rounded-sm bg-[hsl(270_52%_34%/0.15)] whitespace-nowrap">
                <span>{selectedBrand}</span>
                <button onClick={() => setSelectedBrand(null)}>
                  <X size={11} />
                </button>
              </div>
            )}
            <div className="relative flex-1">
              <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('products', 'search')}
                className="w-full bg-secondary border border-border ps-9 pe-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-52 shrink-0 sticky top-24 bg-card border border-[hsl(270_52%_34%/0.3)] rounded-sm p-4 max-h-[calc(100vh-7rem)] overflow-hidden flex-col">
            <SidebarContent />
          </aside>

          {/* Mobile sidebar overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween', duration: 0.25 }}
                  className="fixed top-0 bottom-0 left-0 w-72 bg-card border-r border-[hsl(270_52%_34%/0.4)] z-50 lg:hidden p-6 pt-16 overflow-y-auto"
                >
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-5 right-5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <SidebarContent />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="font-display text-xl text-primary mb-2">
                  {selectedBrand ? t('brands', 'comingSoon') : t('brands', 'noResults')}
                </p>
                <p className="text-muted-foreground text-sm">
                  {selectedBrand
                    ? `${t('brands', 'comingSoonDesc')} ${selectedBrand}`
                    : t('brands', 'adjustFilters')}
                </p>
                {selectedBrand && (
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className="mt-4 text-sm text-primary border border-primary/30 px-4 py-2 hover:bg-primary/10 transition-colors"
                  >
                    {t('brands', 'viewAll')}
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfumesPage;
