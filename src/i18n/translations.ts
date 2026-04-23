export type Language = 'ar' | 'en' | 'tr';

export const translations = {
  // Navigation
  nav: {
    home: { ar: 'الرئيسية', en: 'Home', tr: 'Ana Sayfa' },
    perfumes: { ar: 'العطور', en: 'Perfumes', tr: 'Parfümler' },
    aboutUs: { ar: 'من نحن', en: 'About Us', tr: 'Hakkımızda' },
    aboutOils: { ar: 'عن الزيوت', en: 'About Oils', tr: 'Yağlar Hakkında' },
    contact: { ar: 'اتصل بنا', en: 'Contact', tr: 'İletişim' },
    cart: { ar: 'السلة', en: 'Cart', tr: 'Sepet' },
  },
  // Hero
  hero: {
    tagline: {
      ar: 'روح إسطنبول في كل قطرة',
      en: 'The Spirit of Istanbul in Every Drop',
      tr: 'Her Damlada İstanbul\'un Ruhu',
    },
    shopNow: { ar: 'تسوق الآن', en: 'Shop Now', tr: 'Şimdi Alışveriş Yap' },
    discover: { ar: 'اكتشف المجموعة', en: 'Discover Collection', tr: 'Koleksiyonu Keşfet' },
  },
  // Sections
  sections: {
    featured: { ar: 'العطور المميزة', en: 'Featured Perfumes', tr: 'Öne Çıkan Parfümler' },
    categories: { ar: 'التصنيفات', en: 'Categories', tr: 'Kategoriler' },
    men: { ar: 'رجالي', en: 'Men', tr: 'Erkek' },
    women: { ar: 'نسائي', en: 'Women', tr: 'Kadın' },
    inspired: { ar: 'مستوحاة من أرقى العطور العالمية', en: 'Inspired by Global Fragrances', tr: 'Dünya Parfümlerinden İlham Alındı' },
    inspiredDesc: {
      ar: 'نختار أجود المكونات من جميع أنحاء العالم لنصنع عطوراً تنافس أشهر العلامات التجارية الفاخرة',
      en: 'We select the finest ingredients from around the world to craft fragrances that rival the most prestigious luxury brands',
      tr: 'Dünyanın en prestijli lüks markalarıyla yarışan kokular yaratmak için dünyanın dört bir yanından en kaliteli malzemeleri seçiyoruz',
    },
    brandStory: { ar: 'قصة العلامة', en: 'Brand Story', tr: 'Marka Hikayesi' },
    brandStoryTitle: { ar: 'روح إسطنبول', en: 'The Spirit of Istanbul', tr: 'İstanbul\'un Ruhu' },
    brandStoryText: {
      ar: 'أرجوان إسطنبول ولدت من شغف بالعطور الفاخرة وحب لمدينة إسطنبول الساحرة. نمزج بين التراث الشرقي العريق وأناقة العصر الحديث لنقدم لكم عطوراً استثنائية تحكي قصة كل لحظة',
      en: 'Arjwan Istanbul was born from a passion for luxury fragrances and a love for the enchanting city of Istanbul. We blend the rich Eastern heritage with modern elegance to present you exceptional perfumes that tell the story of every moment',
      tr: 'Arjwan İstanbul, lüks parfümlere olan tutkudan ve büyüleyici İstanbul şehrine olan sevgiden doğdu. Zengin Doğu mirasını modern zarafetle harmanlayarak her anın hikayesini anlatan olağanüstü parfümler sunuyoruz',
    },
    newsletter: { ar: 'النشرة البريدية', en: 'Newsletter', tr: 'Bülten' },
    newsletterDesc: { ar: 'اشترك للحصول على أحدث العروض', en: 'Subscribe for latest offers', tr: 'En son teklifler için abone olun' },
    subscribe: { ar: 'اشترك', en: 'Subscribe', tr: 'Abone Ol' },
    email: { ar: 'بريدك الإلكتروني', en: 'Your email', tr: 'E-posta adresiniz' },
    testimonials: { ar: 'آراء العملاء', en: 'Testimonials', tr: 'Müşteri Yorumları' },
  },
  // Products
  products: {
    viewDetails: { ar: 'عرض التفاصيل', en: 'View Details', tr: 'Detayları Gör' },
    addToCart: { ar: 'أضف إلى السلة', en: 'Add to Cart', tr: 'Sepete Ekle' },
    concentration: { ar: 'التركيز', en: 'Concentration', tr: 'Konsantrasyon' },
    heavy: { ar: 'مكثف (30% زيت)', en: 'Intense (30% oil)', tr: 'Yoğun (30% yağ)' },
    light: { ar: 'خفيف (20% زيت)', en: 'Light (20% oil)', tr: 'Hafif (20% yağ)' },
    size: { ar: 'الحجم', en: 'Size', tr: 'Boyut' },
    quantity: { ar: 'الكمية', en: 'Quantity', tr: 'Miktar' },
    notes: { ar: 'المكونات', en: 'Notes', tr: 'Notalar' },
    topNotes: { ar: 'المقدمة', en: 'Top Notes', tr: 'Üst Notalar' },
    middleNotes: { ar: 'القلب', en: 'Middle Notes', tr: 'Orta Notalar' },
    baseNotes: { ar: 'القاعدة', en: 'Base Notes', tr: 'Alt Notalar' },
    filterAll: { ar: 'الكل', en: 'All', tr: 'Tümü' },
    search: { ar: 'ابحث عن عطر...', en: 'Search perfume...', tr: 'Parfüm ara...' },
    description: { ar: 'الوصف', en: 'Description', tr: 'Açıklama' },
  },
  // Brands sidebar
  brands: {
    filterBy: { ar: 'تصفية حسب', en: 'Filter By', tr: 'Filtrele' },
    inspiration: { ar: 'الإلهام', en: 'Inspiration', tr: 'İlham' },
    allBrands: { ar: 'جميع العلامات', en: 'All Brands', tr: 'Tüm Markalar' },
    brandsBtn: { ar: 'العلامات', en: 'Brands', tr: 'Markalar' },
    clear: { ar: 'مسح', en: 'Clear', tr: 'Temizle' },
    selected: { ar: 'المحدد', en: 'Selected', tr: 'Seçili' },
    forMen: { ar: 'للرجال', en: 'FOR MEN', tr: 'ERKEKLER İÇİN' },
    forWomen: { ar: 'للنساء', en: 'FOR WOMEN', tr: 'KADINLAR İÇİN' },
    inspiredBy: { ar: 'مستوحى من', en: 'Inspired by', tr: 'İlham Alınan' },
    comingSoon: { ar: 'قريباً', en: 'Coming Soon', tr: 'Yakında' },
    comingSoonDesc: { ar: 'نعمل على عطور جديدة مستوحاة من', en: "We're working on new fragrances inspired by", tr: 'Yeni parfümler üzerinde çalışıyoruz, ilham kaynağı:' },
    viewAll: { ar: 'عرض جميع العطور', en: 'View all fragrances', tr: 'Tüm parfümleri gör' },
    noResults: { ar: 'لم يتم العثور على عطور', en: 'No perfumes found', tr: 'Parfüm bulunamadı' },
    adjustFilters: { ar: 'حاول تعديل البحث أو التصفية', en: 'Try adjusting your search or filters', tr: 'Arama veya filtrelerinizi ayarlamayı deneyin' },
  },
  // Cart
  cart: {
    title: { ar: 'سلة التسوق', en: 'Shopping Cart', tr: 'Alışveriş Sepeti' },
    empty: { ar: 'سلتك فارغة', en: 'Your cart is empty', tr: 'Sepetiniz boş' },
    emptyDesc: { ar: 'أضف بعض العطور الرائعة إلى سلتك', en: 'Add some amazing fragrances to your cart', tr: 'Sepetinize harika parfümler ekleyin' },
    total: { ar: 'المجموع', en: 'Total', tr: 'Toplam' },
    checkout: { ar: 'إتمام الطلب عبر واتساب', en: 'Order via WhatsApp', tr: 'WhatsApp ile Sipariş Ver' },
    remove: { ar: 'إزالة', en: 'Remove', tr: 'Kaldır' },
    continueShopping: { ar: 'متابعة التسوق', en: 'Continue Shopping', tr: 'Alışverişe Devam' },
    yourItems: { ar: 'منتجاتك', en: 'Your Items', tr: 'Ürünleriniz' },
    orderDetails: { ar: 'تفاصيل الطلب', en: 'Order Details', tr: 'Sipariş Detayları' },
    name: { ar: 'الاسم الكامل', en: 'Full Name', tr: 'Ad Soyad' },
    enterName: { ar: 'أدخل اسمك الكامل', en: 'Enter your full name', tr: 'Adınızı ve soyadınızı girin' },
    phone: { ar: 'رقم الهاتف', en: 'Phone Number', tr: 'Telefon Numarası' },
    enterPhone: { ar: 'أدخل رقم هاتفك', en: 'Enter your phone number', tr: 'Telefon numaranızı girin' },
    email: { ar: 'البريد الإلكتروني', en: 'Email Address', tr: 'E-posta Adresi' },
    enterEmail: { ar: 'أدخل بريدك الإلكتروني', en: 'Enter your email address', tr: 'E-posta adresinizi girin' },
    address: { ar: 'عنوان التوصيل', en: 'Delivery Address', tr: 'Teslimat Adresi' },
    enterAddress: { ar: 'أدخل عنوانك الكامل (المدينة، الشارع، المبنى)', en: 'Enter your full address (city, street, building)', tr: 'Tam adresinizi girin (şehir, cadde, bina)' },
    nameRequired: { ar: 'الاسم مطلوب', en: 'Name is required', tr: 'Ad gereklidir' },
    phoneRequired: { ar: 'رقم الهاتف مطلوب', en: 'Phone number is required', tr: 'Telefon numarası gereklidir' },
    emailRequired: { ar: 'البريد الإلكتروني غير صالح', en: 'Valid email is required', tr: 'Geçerli e-posta gereklidir' },
    addressRequired: { ar: 'العنوان مطلوب', en: 'Address is required', tr: 'Adres gereklidir' },
    thankYouTitle: { ar: 'شكراً لك!', en: 'Thank You!', tr: 'Teşekkürler!' },
    thankYouSubtitle: { ar: 'تم استلام طلبك بنجاح', en: 'Your order has been received', tr: 'Siparişiniz alındı' },
    thankYouDesc: { ar: 'انقر أدناه للتواصل معنا عبر واتساب لإتمام طلبك', en: 'Click below to contact us on WhatsApp to complete your order', tr: 'Siparişinizi tamamlamak için aşağıdan WhatsApp\'tan bize yazın' },
    openWhatsapp: { ar: 'فتح واتساب', en: 'Open WhatsApp', tr: 'WhatsApp\'ı Aç' },
  },
  // About
  about: {
    title: { ar: 'من نحن', en: 'About Us', tr: 'Hakkımızda' },
    vision: { ar: 'رؤيتنا', en: 'Our Vision', tr: 'Vizyonumuz' },
    visionText: {
      ar: 'نسعى لأن نكون العلامة التجارية الرائدة في تقديم العطور الفاخرة المستوحاة من أرقى العطور العالمية بأسعار منافسة',
      en: 'We strive to be the leading brand in offering luxury fragrances inspired by the finest global perfumes at competitive prices',
      tr: 'En kaliteli küresel parfümlerden ilham alan lüks kokuları rekabetçi fiyatlarla sunan lider marka olmayı hedefliyoruz',
    },
  },
  // About Oils
  aboutOils: {
    title: { ar: 'عن الزيوت العطرية', en: 'About Fragrance Oils', tr: 'Parfüm Yağları Hakkında' },
    qualityTitle: { ar: 'جودة لا مثيل لها', en: 'Unmatched Quality', tr: 'Eşsiz Kalite' },
    qualityText: {
      ar: 'نستخدم أجود أنواع الزيوت العطرية المستوردة من فرنسا وسويسرا لضمان ثبات العطر وانتشاره',
      en: 'We use the finest fragrance oils imported from France and Switzerland to ensure longevity and projection',
      tr: 'Kalıcılığı ve yayılımı sağlamak için Fransa ve İsviçre\'den ithal edilen en kaliteli parfüm yağlarını kullanıyoruz',
    },
    concentrationTitle: { ar: 'الفرق بين التركيزات', en: 'Concentration Differences', tr: 'Konsantrasyon Farkları' },
    heavyDesc: {
      ar: 'مكثف: 30% زيت عطري / 70% كحول - ثبات يدوم طوال اليوم مع انتشار قوي',
      en: 'Intense: 30% oil / 70% alcohol - All-day lasting with strong projection',
      tr: 'Yoğun: %30 yağ / %70 alkol - Güçlü yayılımla gün boyu kalıcı',
    },
    lightDesc: {
      ar: 'خفيف: 20% زيت عطري / 80% كحول - مثالي للاستخدام اليومي',
      en: 'Light: 20% oil / 80% alcohol - Perfect for daily use',
      tr: 'Hafif: %20 yağ / %80 alkol - Günlük kullanım için ideal',
    },
  },
  // Contact
  contact: {
    title: { ar: 'تواصل معنا', en: 'Contact Us', tr: 'Bize Ulaşın' },
    whatsapp: { ar: 'تواصل عبر واتساب', en: 'Chat on WhatsApp', tr: 'WhatsApp\'tan Yazın' },
    followUs: { ar: 'تابعنا', en: 'Follow Us', tr: 'Bizi Takip Edin' },
  },
  // Footer
  footer: {
    rights: { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved', tr: 'Tüm hakları saklıdır' },
  },
} as const;

export type TranslationKey = keyof typeof translations;
