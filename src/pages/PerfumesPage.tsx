import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';
import BannerSlider from '@/components/BannerSlider';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PAGE_SIZE = 12;

type SortKey = 'popular' | 'az' | 'za' | 'price_asc' | 'price_desc';

const SCENT_FAMILIES = [
  { key: 'oud',      emoji: '🪵', label: { ar: 'عود',   en: 'Oud',      tr: 'Oud'      }, keywords: ['oud', 'agarwood', 'عود'] },
  { key: 'oriental', emoji: '✨', label: { ar: 'شرقي',  en: 'Oriental', tr: 'Oriental'  }, keywords: ['oriental', 'amber', 'musk', 'incense', 'resin', 'عنبر', 'مسك'] },
  { key: 'floral',   emoji: '🌸', label: { ar: 'زهري',  en: 'Floral',   tr: 'Çiçeksi'  }, keywords: ['rose', 'jasmine', 'floral', 'peony', 'lily', 'iris', 'violet', 'ورد', 'ياسمين'] },
  { key: 'woody',    emoji: '🌲', label: { ar: 'خشبي',  en: 'Woody',    tr: 'Odunsu'   }, keywords: ['cedar', 'sandalwood', 'wood', 'vetiver', 'patchouli', 'خشب', 'صندل'] },
  { key: 'fresh',    emoji: '💧', label: { ar: 'منعش',  en: 'Fresh',    tr: 'Ferah'    }, keywords: ['citrus', 'fresh', 'bergamot', 'lemon', 'lime', 'marine', 'green', 'mint', 'منعش'] },
];

const SORT_OPTIONS: { key: SortKey; label: { ar: string; en: string; tr: string } }[] = [
  { key: 'popular',    label: { ar: 'الأكثر شيوعاً', en: 'Most Popular',  tr: 'En Popüler'   } },
  { key: 'az',         label: { ar: 'أ — ي',          en: 'Name A – Z',   tr: 'İsim A – Z'   } },
  { key: 'za',         label: { ar: 'ي — أ',          en: 'Name Z – A',   tr: 'İsim Z – A'   } },
  { key: 'price_asc',  label: { ar: 'السعر: الأقل',   en: 'Price: Low',   tr: 'Fiyat: Düşük' } },
  { key: 'price_desc', label: { ar: 'السعر: الأعلى',  en: 'Price: High',  tr: 'Fiyat: Yüksek'} },
];

const PerfumesPage = () => {
  const { t, lang } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brandSearch, setBrandSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scentFamily, setScentFamily] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('popular');
  const [sortOpen, setSortOpen] = useState(false);
  const [brandSectionOpen, setBrandSectionOpen] = useState(true);
  const [scentSectionOpen, setScentSectionOpen] = useState(true);
  const [searchStuck, setSearchStuck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const category = searchParams.get('category') || 'all';
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: siteSettings } = useSettings();
  const perfumeBanners: string[] = Array.isArray(siteSettings?.perfumeBanners) ? siteSettings.perfumeBanners : [];
  const perfumeBannersMobile: string[] = Array.isArray(siteSettings?.perfumeBannersMobile) ? siteSettings.perfumeBannersMobile : [];
  const bannerHeight = Number(siteSettings?.bannerHeight) || 400;
  const bannerHeightMobile = Number(siteSettings?.bannerHeightMobile) || 220;

  // Sticky search sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setSearchStuck(!e.isIntersecting), { threshold: 1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Brand list
  const allBrands = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      if (!p.inspiredBy) return;
      if (category !== 'all' && p.category !== category) return;
      map[p.inspiredBy] = (map[p.inspiredBy] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  }, [products, category]);

  const filteredBrands = useMemo(() => {
    if (!brandSearch) return allBrands;
    const q = brandSearch.toLowerCase();
    return allBrands.filter((b) => b.name.toLowerCase().includes(q));
  }, [allBrands, brandSearch]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchCategory = category === 'all' || p.category === category;
      const matchBrand = !selectedBrand || p.inspiredBy === selectedBrand;
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        p.name[lang].toLowerCase().includes(q) ||
        p.originalPerfume.toLowerCase().includes(q) ||
        (p.inspiredBy || '').toLowerCase().includes(q);
      const matchScent = !scentFamily
        ? true
        : (() => {
            const sf = SCENT_FAMILIES.find((f) => f.key === scentFamily);
            if (!sf) return true;
            const hay = [p.description?.en, p.notes?.top?.en, p.notes?.middle?.en, p.notes?.base?.en]
              .join(' ').toLowerCase();
            return sf.keywords.some((kw) => hay.includes(kw.toLowerCase()));
          })();
      return matchCategory && matchBrand && matchSearch && matchScent;
    });

    switch (sort) {
      case 'popular':   list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
      case 'az':        list = [...list].sort((a, b) => a.originalPerfume.localeCompare(b.originalPerfume)); break;
      case 'za':        list = [...list].sort((a, b) => b.originalPerfume.localeCompare(a.originalPerfume)); break;
      case 'price_asc': list = [...list].sort((a, b) => a.price50ml - b.price50ml); break;
      case 'price_desc':list = [...list].sort((a, b) => b.price50ml - a.price50ml); break;
    }
    return list;
  }, [category, search, lang, selectedBrand, scentFamily, sort, products]);

  const totalForCategory = useMemo(
    () => products.filter((p) => category === 'all' || p.category === category).length,
    [category, products]
  );

  // Count products per scent family (unfiltered by scent, so counts are always visible)
  const scentCounts = useMemo(() => {
    const base = products.filter((p) => {
      const matchCategory = category === 'all' || p.category === category;
      const matchBrand = !selectedBrand || p.inspiredBy === selectedBrand;
      return matchCategory && matchBrand;
    });
    return Object.fromEntries(
      SCENT_FAMILIES.map((sf) => [
        sf.key,
        base.filter((p) => {
          const hay = [p.description?.en, p.notes?.top?.en, p.notes?.middle?.en, p.notes?.base?.en]
            .join(' ').toLowerCase();
          return sf.keywords.some((kw) => hay.includes(kw.toLowerCase()));
        }).length,
      ])
    );
  }, [products, category, selectedBrand]);

  // Reset pagination when filters change
  useEffect(() => { setCurrentPage(1); }, [category, search, selectedBrand, scentFamily, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentProducts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeFilterCount = [selectedBrand, scentFamily].filter(Boolean).length;

  const setCategory = (cat: string) => {
    if (cat === 'all') searchParams.delete('category');
    else searchParams.set('category', cat);
    setSearchParams(searchParams);
    setSelectedBrand(null);
    setBrandSearch('');
  };

  const clearAll = () => {
    setSelectedBrand(null);
    setScentFamily(null);
    setBrandSearch('');
    setSearch('');
  };

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="h-full flex flex-col gap-0">
      {/* Sidebar header */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-[hsl(270_52%_34%/0.25)]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-primary" />
          <span className="text-xs tracking-[0.25em] uppercase text-primary font-medium">
            {lang === 'ar' ? 'التصفية' : lang === 'tr' ? 'Filtreler' : 'Filters'}
          </span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[10px] text-muted-foreground hover:text-red-400 transition-colors tracking-wider uppercase flex items-center gap-1"
          >
            <X size={10} />
            {lang === 'ar' ? 'مسح الكل' : lang === 'tr' ? 'Temizle' : 'Clear all'}
          </button>
        )}
      </div>

      {/* ── Scent families ── */}
      <div className="mb-4">
        <button
          onClick={() => setScentSectionOpen((v) => !v)}
          className="w-full flex items-center justify-between py-2 text-xs tracking-[0.2em] uppercase text-muted-foreground/70 hover:text-primary transition-colors"
        >
          <span>{lang === 'ar' ? 'العائلة العطرية' : lang === 'tr' ? 'Koku Ailesi' : 'Scent Family'}</span>
          {scentSectionOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        <AnimatePresence initial={false}>
          {scentSectionOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1 pt-1">
                {SCENT_FAMILIES.map((sf) => {
                  const active = scentFamily === sf.key;
                  const count = scentCounts[sf.key] ?? 0;
                  return (
                    <button
                      key={sf.key}
                      onClick={() => setScentFamily(active ? null : sf.key)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm transition-all border ${
                        active
                          ? 'bg-primary/20 border-primary/60 text-primary'
                          : 'border-transparent text-foreground/70 hover:bg-[hsl(270_52%_34%/0.15)] hover:text-primary'
                      }`}
                    >
                      <span>{sf.emoji}</span>
                      <span className="tracking-wide flex-1 text-start">{sf.label[lang]}</span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-full shrink-0 ${
                        active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>{count}</span>
                      {active && <X size={11} className="opacity-60 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Brand / Inspiration ── */}
      <div className="flex flex-col min-h-0 flex-1">
        <button
          onClick={() => setBrandSectionOpen((v) => !v)}
          className="w-full flex items-center justify-between py-2 text-xs tracking-[0.2em] uppercase text-muted-foreground/70 hover:text-primary transition-colors border-t border-[hsl(270_52%_34%/0.2)]"
        >
          <span>{lang === 'ar' ? 'الإلهام' : lang === 'tr' ? 'İlham' : 'Inspiration'}</span>
          <div className="flex items-center gap-2">
            {selectedBrand && (
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">1</span>
            )}
            {brandSectionOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {brandSectionOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden flex flex-col flex-1 min-h-0"
            >
              <div className="pt-2 flex flex-col gap-2 flex-1 min-h-0">
                {/* All brands */}
                <button
                  onClick={() => { setSelectedBrand(null); setBrandSearch(''); }}
                  className={`w-full text-start px-3 py-2 text-sm rounded-sm transition-all flex items-center justify-between border ${
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

                {/* Brand search */}
                <div className="relative">
                  <Search size={12} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    placeholder={lang === 'ar' ? 'ابحث عن ماركة...' : lang === 'tr' ? 'Marka ara...' : 'Search brand...'}
                    className="w-full bg-secondary border border-border ps-7 pe-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors rounded-sm"
                  />
                  {brandSearch && (
                    <button onClick={() => setBrandSearch('')} className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground">
                      <X size={10} />
                    </button>
                  )}
                </div>

                {/* Brand list */}
                <div className="flex-1 overflow-y-auto space-y-0.5" style={{ scrollbarWidth: 'thin', maxHeight: '280px' }}>
                  {filteredBrands.length === 0 ? (
                    <p className="text-xs text-muted-foreground/50 text-center py-4">
                      {lang === 'ar' ? 'لا توجد ماركات' : lang === 'tr' ? 'Marka bulunamadı' : 'No brands found'}
                    </p>
                  ) : (
                    filteredBrands.map(({ name, count }) => {
                      const isActive = selectedBrand === name;
                      return (
                        <button
                          key={name}
                          onClick={() => setSelectedBrand(isActive ? null : name)}
                          className={`group w-full text-start px-3 py-1.5 text-sm rounded-sm transition-all flex items-center justify-between ${
                            isActive
                              ? 'bg-[hsl(270_52%_34%/0.3)] border border-[hsl(270_52%_50%/0.5)] text-primary'
                              : 'hover:bg-[hsl(270_52%_34%/0.15)] text-foreground/80 hover:text-primary border border-transparent'
                          }`}
                        >
                          <span className="truncate text-sm">{name}</span>
                          <span className={`text-[11px] ms-1 shrink-0 px-1.5 py-0.5 rounded-full ${
                            isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                          }`}>{count}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const currentSort = SORT_OPTIONS.find((s) => s.key === sort)!;

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

        {/* Offer Banners */}
        {perfumeBanners.length > 0 && (
          <div className="mb-6">
            <BannerSlider banners={perfumeBanners} bannersMobile={perfumeBannersMobile} height={bannerHeight} heightMobile={bannerHeightMobile} links={['/offers', '/offers']} />
          </div>
        )}

        {/* Category pills + sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mobile filters toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm tracking-wider border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all rounded-sm relative"
            >
              <SlidersHorizontal size={14} />
              {lang === 'ar' ? 'الفلاتر' : lang === 'tr' ? 'Filtreler' : 'Filters'}
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -end-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {(['all', 'men', 'women'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 text-sm tracking-wider transition-all border rounded-sm ${
                  category === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {cat === 'all' ? t('products', 'filterAll') : t('sections', cat)}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all rounded-sm tracking-wide"
            >
              <ArrowUpDown size={14} />
              <span className="hidden sm:inline">{currentSort.label[lang]}</span>
              <ChevronDown size={13} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute end-0 top-full mt-1.5 bg-card border border-border rounded-sm shadow-xl z-30 min-w-[180px] overflow-hidden"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setSort(opt.key); setSortOpen(false); }}
                      className={`w-full text-start px-4 py-2.5 text-sm transition-colors ${
                        sort === opt.key
                          ? 'bg-primary/15 text-primary'
                          : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {opt.label[lang]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sentinel for sticky search */}
        <div ref={sentinelRef} className="h-px -mt-px" />

        {/* Sticky search bar */}
        <div className={`sticky top-16 z-20 transition-all duration-300 mb-6 ${
          searchStuck ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border py-2 -mx-4 px-4' : 'py-0'
        }`}>
          <div className="flex flex-wrap items-center gap-2">
            {/* Search input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('products', 'search')}
                className="w-full bg-secondary border border-border ps-9 pe-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors rounded-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Active filter chips */}
            <AnimatePresence>
              {selectedBrand && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 text-xs text-primary border border-primary/40 px-2.5 py-1.5 rounded-full bg-primary/10 whitespace-nowrap"
                >
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand(null)}>
                    <X size={11} />
                  </button>
                </motion.div>
              )}
              {scentFamily && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 text-xs text-primary border border-primary/40 px-2.5 py-1.5 rounded-full bg-primary/10 whitespace-nowrap"
                >
                  {SCENT_FAMILIES.find((f) => f.key === scentFamily)?.emoji}{' '}
                  {SCENT_FAMILIES.find((f) => f.key === scentFamily)?.label[lang]}
                  <button onClick={() => setScentFamily(null)}>
                    <X size={11} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result count */}
            <span className="text-xs text-muted-foreground/50 tracking-wider ms-auto whitespace-nowrap">
              {productsLoading ? '…' : `${filtered.length} ${lang === 'ar' ? 'عطر' : lang === 'tr' ? 'parfüm' : 'perfumes'}`}
            </span>
          </div>
        </div>

        <div className="flex gap-6 items-start">

          {/* Desktop sidebar */}
          <aside className="hidden lg:flex w-60 shrink-0 sticky top-32 bg-card border border-[hsl(270_52%_34%/0.3)] rounded-sm p-4 flex-col"
            style={{ maxHeight: 'calc(100vh - 9rem)' }}>
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
                  initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
                  transition={{ type: 'tween', duration: 0.25 }}
                  className="fixed top-0 bottom-0 start-0 w-72 bg-card border-e border-[hsl(270_52%_34%/0.4)] z-50 lg:hidden p-6 pt-16 flex flex-col overflow-y-auto"
                >
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 end-4 text-muted-foreground hover:text-primary transition-colors"
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
                <p className="text-muted-foreground text-sm mb-4">{t('brands', 'adjustFilters')}</p>
                {(selectedBrand || search || scentFamily) && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-primary border border-primary/30 px-4 py-2 hover:bg-primary/10 transition-colors rounded-sm"
                  >
                    {t('brands', 'viewAll')}
                  </button>
                )}
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {currentProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-border text-sm tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors rounded-sm"
                    >
                      {lang === 'ar' ? 'السابق' : lang === 'tr' ? 'Önceki' : 'Previous'}
                    </button>
                    <span className="text-sm text-muted-foreground">
                      {lang === 'ar' ? `صفحة ${currentPage} من ${totalPages}` : lang === 'tr' ? `Sayfa ${currentPage} / ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-border text-sm tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors rounded-sm"
                    >
                      {lang === 'ar' ? 'التالي' : lang === 'tr' ? 'Sonraki' : 'Next'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Click outside sort */}
      {sortOpen && <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />}
    </div>
  );
};

export default PerfumesPage;
