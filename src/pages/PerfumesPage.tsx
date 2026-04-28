import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PerfumesPage = () => {
  const { t, lang } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brandSearch, setBrandSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scentFamily, setScentFamily] = useState<string | null>(null);
  const category = searchParams.get('category') || 'all';
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const scentFamilies = [
    { key: 'oud', label: { ar: 'عود', en: 'Oud', tr: 'Oud' }, keywords: ['oud', 'عود', 'agarwood'] },
    { key: 'oriental', label: { ar: 'شرقي', en: 'Oriental', tr: 'Oriental' }, keywords: ['oriental', 'شرقي', 'amber', 'musk', 'بخور', 'incense', 'resin'] },
    { key: 'floral', label: { ar: 'زهري', en: 'Floral', tr: 'Çiçeksi' }, keywords: ['rose', 'jasmine', 'floral', 'زهر', 'ورد', 'ياسمين', 'peony', 'lily', 'iris', 'violet'] },
    { key: 'woody', label: { ar: 'خشبي', en: 'Woody', tr: 'Odunsu' }, keywords: ['cedar', 'sandalwood', 'wood', 'خشب', 'صندل', 'vetiver', 'patchouli'] },
    { key: 'fresh', label: { ar: 'منعش', en: 'Fresh', tr: 'Ferah' }, keywords: ['citrus', 'fresh', 'منعش', 'bergamot', 'lemon', 'lime', 'aquatic', 'marine', 'green'] },
  ];

  // Build dynamic brand list from actual products
  const allBrands = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      if (!p.inspiredBy) return;
      const catOk = category === 'all' || p.category === category;
      if (!catOk) return;
      map[p.inspiredBy] = (map[p.inspiredBy] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1]) // sort by count desc
      .map(([name, count]) => ({ name, count }));
  }, [products, category]);

  const filteredBrands = useMemo(() => {
    if (!brandSearch) return allBrands;
    const q = brandSearch.toLowerCase();
    return allBrands.filter((b) => b.name.toLowerCase().includes(q));
  }, [allBrands, brandSearch]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = category === 'all' || p.category === category;
      const matchBrand = !selectedBrand || p.inspiredBy === selectedBrand;
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        p.name[lang].toLowerCase().includes(q) ||
        p.originalPerfume.toLowerCase().includes(q) ||
        p.inspiredBy.toLowerCase().includes(q);
      const matchScent = !scentFamily
        ? true
        : (() => {
            const sf = scentFamilies.find((f) => f.key === scentFamily);
            if (!sf) return true;
            const haystack = [
              p.description?.en || '',
              p.notes?.top?.en || '',
              p.notes?.middle?.en || '',
              p.notes?.base?.en || '',
            ].join(' ').toLowerCase();
            return sf.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
          })();
      return matchCategory && matchBrand && matchSearch && matchScent;
    });
  }, [category, search, lang, selectedBrand, scentFamily, products]);

  const totalForCategory = useMemo(
    () => products.filter((p) => category === 'all' || p.category === category).length,
    [category, products]
  );

  const setCategory = (cat: string) => {
    if (cat === 'all') searchParams.delete('category');
    else searchParams.set('category', cat);
    setSearchParams(searchParams);
    setSelectedBrand(null);
    setBrandSearch('');
  };

  const handleBrandSelect = (brand: string | null) => {
    setSelectedBrand(brand);
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 mb-0.5">
            {t('brands', 'filterBy')}
          </p>
          <h3 className="font-display text-base text-primary tracking-wide">
            {t('brands', 'inspiration')}
          </h3>
        </div>
        {selectedBrand && (
          <button
            onClick={() => { setSelectedBrand(null); setBrandSearch(''); }}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <X size={12} /> {t('brands', 'clear')}
          </button>
        )}
      </div>

      {/* All brands button */}
      <button
        onClick={() => handleBrandSelect(null)}
        className={`w-full text-start px-3 py-2 text-sm rounded-sm transition-all duration-200 flex items-center justify-between border ${
          !selectedBrand
            ? 'bg-primary text-primary-foreground border-primary'
            : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
        }`}
      >
        <span>{t('brands', 'allBrands')}</span>
        <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
          !selectedBrand ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>{totalForCategory}</span>
      </button>

      {/* Brand search input */}
      <div className="relative">
        <Search size={13} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
        <input
          type="text"
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          placeholder={lang === 'ar' ? 'ابحث عن ماركة...' : lang === 'tr' ? 'Marka ara...' : 'Search brand...'}
          className="w-full bg-secondary border border-border ps-8 pe-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors rounded-sm"
        />
        {brandSearch && (
          <button
            onClick={() => setBrandSearch('')}
            className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* Scrollable brand list */}
      <div className="flex-1 overflow-y-auto space-y-0.5 pr-0.5" style={{ scrollbarWidth: 'thin' }}>
        {filteredBrands.length === 0 ? (
          <p className="text-xs text-muted-foreground/50 text-center py-4">No brands found</p>
        ) : (
          filteredBrands.map(({ name, count }) => {
            const isActive = selectedBrand === name;
            return (
              <button
                key={name}
                onClick={() => handleBrandSelect(isActive ? null : name)}
                className={`group w-full text-start px-3 py-1.5 text-sm rounded-sm transition-all duration-150 flex items-center justify-between ${
                  isActive
                    ? 'bg-[hsl(270_52%_34%/0.3)] border border-[hsl(270_52%_50%/0.5)] text-primary'
                    : 'hover:bg-[hsl(270_52%_34%/0.15)] text-foreground/80 hover:text-primary border border-transparent'
                }`}
              >
                <span className="truncate text-sm">{name}</span>
                <span className={`text-[11px] ml-1 shrink-0 px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }`}>{count}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Selected brand info */}
      {selectedBrand && (
        <div className="pt-3 border-t border-[hsl(270_52%_34%/0.25)]">
          <p className="text-[10px] text-muted-foreground/50 tracking-widest uppercase mb-1">
            {t('brands', 'selected')}
          </p>
          <p className="text-sm text-primary font-display">{selectedBrand}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {filtered.length} {lang === 'ar' ? 'عطر' : lang === 'tr' ? 'parfüm' : 'perfumes'}
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
          <div className="flex items-center gap-2 flex-wrap">
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

            {(['all', 'men', 'women'] as const).map((cat) => (
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

          {/* Scent family filter row */}
          <div className="flex items-center gap-2 flex-wrap mt-3 sm:mt-0">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40 hidden sm:inline">
              {lang === 'ar' ? 'العائلة العطرية:' : lang === 'tr' ? 'Koku ailesi:' : 'Scent:'}
            </span>
            {scentFamilies.map((sf) => (
              <button
                key={sf.key}
                onClick={() => setScentFamily(scentFamily === sf.key ? null : sf.key)}
                className={`px-3 py-1.5 text-xs tracking-wider rounded-full border transition-all ${
                  scentFamily === sf.key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border/70 text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {sf.label[lang]}
              </button>
            ))}
            {scentFamily && (
              <button onClick={() => setScentFamily(null)} className="text-xs text-muted-foreground/50 hover:text-primary transition-colors">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-72 flex items-center gap-2">
            {selectedBrand && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-primary border border-[hsl(270_52%_50%/0.4)] px-2 py-1 rounded-sm bg-[hsl(270_52%_34%/0.15)] whitespace-nowrap max-w-[130px]">
                <span className="truncate">{selectedBrand}</span>
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
          <aside className="hidden lg:flex w-56 shrink-0 sticky top-24 bg-card border border-[hsl(270_52%_34%/0.3)] rounded-sm p-4 flex-col"
            style={{ height: 'calc(100vh - 7rem)' }}>
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
                  className="fixed top-0 bottom-0 left-0 w-72 bg-card border-r border-[hsl(270_52%_34%/0.4)] z-50 lg:hidden p-6 pt-16 flex flex-col"
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

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-card border border-border rounded-sm aspect-[3/4]" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <p className="font-display text-xl text-primary mb-2">{t('brands', 'noResults')}</p>
                <p className="text-muted-foreground text-sm">{t('brands', 'adjustFilters')}</p>
                {(selectedBrand || search) && (
                  <button
                    onClick={() => { setSelectedBrand(null); setSearch(''); setBrandSearch(''); }}
                    className="mt-4 text-sm text-primary border border-primary/30 px-4 py-2 hover:bg-primary/10 transition-colors"
                  >
                    {t('brands', 'viewAll')}
                  </button>
                )}
              </motion.div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground/50 mb-4 tracking-wider">
                  {filtered.length} {lang === 'ar' ? 'عطر' : lang === 'tr' ? 'parfüm' : 'perfumes'}
                  {selectedBrand && ` · ${selectedBrand}`}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfumesPage;
