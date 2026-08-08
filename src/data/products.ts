export interface Product {
  id: string;
  name: { ar: string; en: string; tr: string };
  description: { ar: string; en: string; tr: string };
  category: 'men' | 'women';
  price50ml: number;
  price100ml: number;
  image: string;
  additionalImages?: string[];
  inspiredBy: string;
  originalPerfume: string;
  notes: {
    top: { ar: string; en: string; tr: string };
    middle: { ar: string; en: string; tr: string };
    base: { ar: string; en: string; tr: string };
  };
  featured?: boolean;
}

export interface Brand {
  name: string;
  gender: 'men' | 'women' | 'both';
  signature: string;
}

export const brands: Brand[] = [
  { name: 'Chanel', gender: 'both', signature: 'Bleu de Chanel · No.5' },
  { name: 'Dior', gender: 'both', signature: 'Sauvage · Miss Dior' },
  { name: 'Tom Ford', gender: 'both', signature: 'Oud Wood · Black Orchid' },
  { name: 'YSL', gender: 'both', signature: 'Y · Black Opium' },
  { name: 'Versace', gender: 'both', signature: 'Eros · Bright Crystal' },
  { name: 'Paco Rabanne', gender: 'both', signature: '1 Million · Olympéa' },
  { name: 'Armani', gender: 'both', signature: 'Acqua di Gio · Si' },
  { name: 'Lancôme', gender: 'women', signature: 'La Vie est Belle · Idôle' },
  { name: 'Gucci', gender: 'women', signature: 'Bloom · Flora' },
  { name: 'Viktor & Rolf', gender: 'women', signature: 'Flowerbomb · Bonbon' },
  { name: 'Carolina Herrera', gender: 'women', signature: 'Good Girl · 212' },
  { name: 'Hugo Boss', gender: 'men', signature: 'Boss Bottled · Hugo' },
  { name: 'Dolce & Gabbana', gender: 'both', signature: 'Light Blue · The One' },
  { name: 'Burberry', gender: 'both', signature: 'Hero · Her' },
  { name: 'Givenchy', gender: 'both', signature: "L'Interdit · Gentlemen" },
];

export const products: Product[] = [
  {
    id: 'bosphorus',
    name: { ar: 'بوسفور', en: 'BOSPHORUS', tr: 'BOĞAZ' },
    description: {
      ar: 'عطر رجالي فاخر يجسد قوة وعمق مضيق البوسفور',
      en: 'A luxurious masculine fragrance embodying the power and depth of the Bosphorus strait',
      tr: 'Boğaz\'ın gücünü ve derinliğini yansıtan lüks bir erkek parfümü',
    },
    category: 'men',
    price50ml: 350,
    price100ml: 550,
    image: 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/man%20perfume%20car%20pic.png',
    inspiredBy: 'Chanel',
    originalPerfume: 'BLEU DE CHANEL',
    notes: {
      top: { ar: 'برغموت، فلفل أسود', en: 'Bergamot, Black Pepper', tr: 'Bergamot, Karabiber' },
      middle: { ar: 'عود، ورد', en: 'Oud, Rose', tr: 'Ud, Gül' },
      base: { ar: 'عنبر، مسك', en: 'Amber, Musk', tr: 'Amber, Misk' },
    },
    featured: true,
  },
  {
    id: 'sultanahmet',
    name: { ar: 'سلطان أحمد', en: 'SULTANAHMET', tr: 'SULTANAHMET' },
    description: {
      ar: 'عطر نسائي أنيق مستوحى من عظمة جامع السلطان أحمد',
      en: 'An elegant feminine fragrance inspired by the grandeur of the Sultan Ahmed Mosque',
      tr: 'Sultan Ahmet Camii\'nin ihtişamından ilham alan zarif bir kadın parfümü',
    },
    category: 'women',
    price50ml: 380,
    price100ml: 600,
    image: 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/women%20perfume%20card%20pic.png',
    inspiredBy: 'Dior',
    originalPerfume: 'MISS DIOR',
    notes: {
      top: { ar: 'ياسمين، زهر البرتقال', en: 'Jasmine, Orange Blossom', tr: 'Yasemin, Portakal Çiçeği' },
      middle: { ar: 'توبيروز، إيلنغ إيلنغ', en: 'Tuberose, Ylang Ylang', tr: 'Tuberöz, Ylang Ylang' },
      base: { ar: 'فانيلا، خشب الصندل', en: 'Vanilla, Sandalwood', tr: 'Vanilya, Sandal Ağacı' },
    },
    featured: true,
  },
  {
    id: 'galata',
    name: { ar: 'غلاطة', en: 'GALATA', tr: 'GALATA' },
    description: {
      ar: 'عطر رجالي عصري يعكس روح برج غلاطة التاريخي',
      en: 'A modern masculine scent reflecting the historic spirit of Galata Tower',
      tr: 'Galata Kulesi\'nin tarihi ruhunu yansıtan modern bir erkek kokusu',
    },
    category: 'men',
    price50ml: 320,
    price100ml: 500,
    image: 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/man%20perfume%20car%20pic.png',
    inspiredBy: 'Dior',
    originalPerfume: 'SAUVAGE',
    notes: {
      top: { ar: 'ليمون، نعناع', en: 'Lemon, Mint', tr: 'Limon, Nane' },
      middle: { ar: 'لافندر، إكليل الجبل', en: 'Lavender, Rosemary', tr: 'Lavanta, Biberiye' },
      base: { ar: 'خشب الأرز، فيتيفر', en: 'Cedarwood, Vetiver', tr: 'Sedir Ağacı, Vetiver' },
    },
    featured: true,
  },
  {
    id: 'princess-islands',
    name: { ar: 'جزر الأميرات', en: 'PRINCESS ISLANDS', tr: 'PRENSES ADALARI' },
    description: {
      ar: 'عطر نسائي منعش يحمل نسيم جزر الأميرات',
      en: 'A refreshing feminine fragrance carrying the breeze of the Princess Islands',
      tr: 'Prenses Adaları\'nın esintisini taşıyan ferahlatıcı bir kadın parfümü',
    },
    category: 'women',
    price50ml: 340,
    price100ml: 530,
    image: 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/women%20perfume%20card%20pic.png',
    inspiredBy: 'Lancôme',
    originalPerfume: 'LA VIE EST BELLE',
    notes: {
      top: { ar: 'خوخ، فريزيا', en: 'Peach, Freesia', tr: 'Şeftali, Frezya' },
      middle: { ar: 'بيوني، مغنوليا', en: 'Peony, Magnolia', tr: 'Şakayık, Manolya' },
      base: { ar: 'مسك أبيض، أخشاب', en: 'White Musk, Woods', tr: 'Beyaz Misk, Odunsu' },
    },
    featured: true,
  },
  {
    id: 'topkapi',
    name: { ar: 'توبكابي', en: 'TOPKAPI', tr: 'TOPKAPI' },
    description: {
      ar: 'عطر رجالي ملكي مستوحى من قصر توبكابي العريق',
      en: 'A regal masculine fragrance inspired by the historic Topkapi Palace',
      tr: 'Tarihi Topkapı Sarayı\'ndan ilham alan asil bir erkek parfümü',
    },
    category: 'men',
    price50ml: 400,
    price100ml: 650,
    image: 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/man%20perfume%20car%20pic.png',
    inspiredBy: 'Tom Ford',
    originalPerfume: 'OUD WOOD',
    notes: {
      top: { ar: 'زعفران، هيل', en: 'Saffron, Cardamom', tr: 'Safran, Kakule' },
      middle: { ar: 'عود كمبودي، ورد تركي', en: 'Cambodian Oud, Turkish Rose', tr: 'Kamboçya Udu, Türk Gülü' },
      base: { ar: 'عنبر، بخور', en: 'Amber, Incense', tr: 'Amber, Tütsü' },
    },
  },
  {
    id: 'hagia-sophia',
    name: { ar: 'آيا صوفيا', en: 'HAGIA SOPHIA', tr: 'AYASOFYA' },
    description: {
      ar: 'عطر نسائي ساحر يجمع بين الشرق والغرب كما تفعل آيا صوفيا',
      en: 'An enchanting feminine fragrance bridging East and West, like Hagia Sophia itself',
      tr: 'Ayasofya gibi Doğu ve Batı\'yı birleştiren büyüleyici bir kadın parfümü',
    },
    category: 'women',
    price50ml: 390,
    price100ml: 620,
    image: 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/women%20perfume%20card%20pic.png',
    inspiredBy: 'YSL',
    originalPerfume: 'BLACK OPIUM',
    notes: {
      top: { ar: 'عنبر، بخور', en: 'Amber, Frankincense', tr: 'Amber, Günlük' },
      middle: { ar: 'ورد دمشقي، زنبق', en: 'Damask Rose, Lily', tr: 'Şam Gülü, Zambak' },
      base: { ar: 'مسك، باتشولي', en: 'Musk, Patchouli', tr: 'Misk, Paçuli' },
    },
  },
  {
    id: 'nisantasi',
    name: { ar: 'نيشانتاشي', en: 'NİŞANTAŞI', tr: 'NİŞANTAŞI' },
    description: {
      ar: 'عطر رجالي مستوحى من أناقة حي نيشانتاشي الراقي',
      en: 'A masculine scent inspired by the elegance of the upscale Nişantaşı district',
      tr: 'Şık Nişantaşı semtinin zarafetinden ilham alan bir erkek kokusu',
    },
    category: 'men',
    price50ml: 360,
    price100ml: 570,
    image: 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/man%20perfume%20car%20pic.png',
    inspiredBy: 'Versace',
    originalPerfume: 'EROS',
    notes: {
      top: { ar: 'جريب فروت، بيرغاموت', en: 'Grapefruit, Bergamot', tr: 'Greyfurt, Bergamot' },
      middle: { ar: 'جنزبيل، حبهان', en: 'Ginger, Cardamom', tr: 'Zencefil, Kakule' },
      base: { ar: 'عنبر، خشب الصندل', en: 'Amber, Sandalwood', tr: 'Amber, Sandal Ağacı' },
    },
  },
  {
    id: 'karakoy',
    name: { ar: 'قراقوي', en: 'KARAKÖY', tr: 'KARAKÖY' },
    description: {
      ar: 'عطر نسائي ساحر يعكس مزيج الفن والحياة في قراقوي',
      en: 'A captivating feminine scent reflecting the art and life of Karaköy',
      tr: 'Karaköy\'ün sanat ve yaşamını yansıtan büyüleyici bir kadın kokusu',
    },
    category: 'women',
    price50ml: 355,
    price100ml: 560,
    image: 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/women%20perfume%20card%20pic.png',
    inspiredBy: 'Gucci',
    originalPerfume: 'BLOOM',
    notes: {
      top: { ar: 'توت أحمر، تفاح', en: 'Red Berry, Apple', tr: 'Kırmızı Meyve, Elma' },
      middle: { ar: 'ورد، فاوانيا', en: 'Rose, Peony', tr: 'Gül, Şakayık' },
      base: { ar: 'مسك، أخشاب', en: 'Musk, Woods', tr: 'Misk, Odun' },
    },
  },
  {
    id: 'besiktas',
    name: { ar: 'بيشكتاش', en: 'BEŞİKTAŞ', tr: 'BEŞİKTAŞ' },
    description: {
      ar: 'عطر رجالي جريء مستوحى من روح بيشكتاش',
      en: 'A bold masculine fragrance inspired by the vibrant spirit of Beşiktaş',
      tr: 'Beşiktaş\'ın canlı ruhundan ilham alan cesur bir erkek parfümü',
    },
    category: 'men',
    price50ml: 330,
    price100ml: 520,
    image: 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/man%20perfume%20car%20pic.png',
    inspiredBy: 'Paco Rabanne',
    originalPerfume: '1 MILLION',
    notes: {
      top: { ar: 'ليمون، توت أسود', en: 'Lemon, Blackcurrant', tr: 'Limon, Siyah Frenk Üzümü' },
      middle: { ar: 'كيناNote، بتولي', en: 'Cinnamon, Patchouli', tr: 'Tarçın, Paçuli' },
      base: { ar: 'فانيلا، لبان', en: 'Vanilla, Labdanum', tr: 'Vanilya, Labdanum' },
    },
  },
  {
    id: 'ortakoy',
    name: { ar: 'أورتاكوي', en: 'ORTAKÖY', tr: 'ORTAKÖY' },
    description: {
      ar: 'عطر نسائي رومانسي يعكس سحر كورنيش أورتاكوي',
      en: 'A romantic feminine fragrance reflecting the charm of the Ortaköy promenade',
      tr: 'Ortaköy sahilinin büyüsünü yansıtan romantik bir kadın parfümü',
    },
    category: 'women',
    price50ml: 370,
    price100ml: 580,
    image: 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/women%20perfume%20card%20pic.png',
    inspiredBy: 'Viktor & Rolf',
    originalPerfume: 'FLOWERBOMB',
    notes: {
      top: { ar: 'برتقال، مندرين', en: 'Orange, Mandarin', tr: 'Portakal, Mandalina' },
      middle: { ar: 'ورد، ياسمين', en: 'Rose, Jasmine', tr: 'Gül, Yasemin' },
      base: { ar: 'مسك، خشب الصندل', en: 'Musk, Sandalwood', tr: 'Misk, Sandal Ağacı' },
    },
  },
  {
    id: 'uskudar',
    name: { ar: 'أوسكودار', en: 'ÜSKÜDAR', tr: 'ÜSKÜDAR' },
    description: {
      ar: 'عطر رجالي كلاسيكي مستوحى من هدوء أوسكودار العريقة',
      en: 'A classic masculine fragrance inspired by the tranquil timelessness of Üsküdar',
      tr: 'Üsküdar\'ın sakin zamansızlığından ilham alan klasik bir erkek parfümü',
    },
    category: 'men',
    price50ml: 345,
    price100ml: 545,
    image: 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/man%20perfume%20car%20pic.png',
    inspiredBy: 'Armani',
    originalPerfume: 'ACQUA DI GIÒ',
    notes: {
      top: { ar: 'خضار بحري، ليمون', en: 'Marine, Lemon', tr: 'Deniz Notası, Limon' },
      middle: { ar: 'ورد، نيرولي', en: 'Rose, Neroli', tr: 'Gül, Neroli' },
      base: { ar: 'خشب الصندل، مسك', en: 'Sandalwood, Musk', tr: 'Sandal Ağacı, Misk' },
    },
  },
  {
    id: 'bebek',
    name: { ar: 'بيبك', en: 'BEBEK', tr: 'BEBEK' },
    description: {
      ar: 'عطر نسائي راقٍ يعكس أناقة حي بيبك الفاخر',
      en: 'A refined feminine fragrance reflecting the elegance of the upscale Bebek neighbourhood',
      tr: 'Şık Bebek semtinin zarafetini yansıtan rafine bir kadın parfümü',
    },
    category: 'women',
    price50ml: 395,
    price100ml: 630,
    image: 'https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/women%20perfume%20card%20pic.png',
    inspiredBy: 'Carolina Herrera',
    originalPerfume: 'GOOD GIRL',
    notes: {
      top: { ar: 'بيرغاموت، ليمون', en: 'Bergamot, Lemon', tr: 'Bergamot, Limon' },
      middle: { ar: 'زهر الياسمين، عنبر', en: 'Jasmine, Iris', tr: 'Yasemin, İris' },
      base: { ar: 'مسك، خشب الصندل', en: 'Musk, Cedarwood', tr: 'Misk, Sedir Ağacı' },
    },
  },
];
