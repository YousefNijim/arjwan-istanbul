import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { adminUsers, perfumes, siteSettings } from '../shared/schema';
import { eq } from 'drizzle-orm';

const initialPerfumes = [
  {
    id: 'bosphorus', nameAr: 'بوسفور', nameEn: 'BOSPHORUS', nameTr: 'BOĞAZ',
    descriptionAr: 'عطر رجالي فاخر يجسد قوة وعمق مضيق البوسفور',
    descriptionEn: 'A luxurious masculine fragrance embodying the power and depth of the Bosphorus strait',
    descriptionTr: "Boğaz'ın gücünü ve derinliğini yansıtan lüks bir erkek parfümü",
    category: 'men', price50ml: 350, price100ml: 550, imageUrl: '/bottle-black.png',
    inspiredBy: 'Chanel', originalPerfume: 'BLEU DE CHANEL',
    notesTopAr: 'برغموت، فلفل أسود', notesTopEn: 'Bergamot, Black Pepper', notesTopTr: 'Bergamot, Karabiber',
    notesMiddleAr: 'عود، ورد', notesMiddleEn: 'Oud, Rose', notesMiddleTr: 'Ud, Gül',
    notesBaseAr: 'عنبر، مسك', notesBaseEn: 'Amber, Musk', notesBaseTr: 'Amber, Misk',
    featured: true, active: true, sortOrder: 1,
  },
  {
    id: 'sultanahmet', nameAr: 'سلطان أحمد', nameEn: 'SULTANAHMET', nameTr: 'SULTANAHMET',
    descriptionAr: 'عطر نسائي أنيق مستوحى من عظمة جامع السلطان أحمد',
    descriptionEn: 'An elegant feminine fragrance inspired by the grandeur of the Sultan Ahmed Mosque',
    descriptionTr: "Sultan Ahmet Camii'nin ihtişamından ilham alan zarif bir kadın parfümü",
    category: 'women', price50ml: 380, price100ml: 600, imageUrl: '/bottle-gold.png',
    inspiredBy: 'Dior', originalPerfume: 'MISS DIOR',
    notesTopAr: 'ياسمين، زهر البرتقال', notesTopEn: 'Jasmine, Orange Blossom', notesTopTr: 'Yasemin, Portakal Çiçeği',
    notesMiddleAr: 'توبيروز، إيلنغ إيلنغ', notesMiddleEn: 'Tuberose, Ylang Ylang', notesMiddleTr: 'Tuberöz, Ylang Ylang',
    notesBaseAr: 'فانيلا، خشب الصندل', notesBaseEn: 'Vanilla, Sandalwood', notesBaseTr: 'Vanilya, Sandal Ağacı',
    featured: true, active: true, sortOrder: 2,
  },
  {
    id: 'galata', nameAr: 'غلاطة', nameEn: 'GALATA', nameTr: 'GALATA',
    descriptionAr: 'عطر رجالي عصري يعكس روح برج غلاطة التاريخي',
    descriptionEn: 'A modern masculine scent reflecting the historic spirit of Galata Tower',
    descriptionTr: "Galata Kulesi'nin tarihi ruhunu yansıtan modern bir erkek kokusu",
    category: 'men', price50ml: 320, price100ml: 500, imageUrl: '/bottle-black.png',
    inspiredBy: 'Dior', originalPerfume: 'SAUVAGE',
    notesTopAr: 'ليمون، نعناع', notesTopEn: 'Lemon, Mint', notesTopTr: 'Limon, Nane',
    notesMiddleAr: 'لافندر، إكليل الجبل', notesMiddleEn: 'Lavender, Rosemary', notesMiddleTr: 'Lavanta, Biberiye',
    notesBaseAr: 'خشب الأرز، فيتيفر', notesBaseEn: 'Cedarwood, Vetiver', notesBaseTr: 'Sedir Ağacı, Vetiver',
    featured: true, active: true, sortOrder: 3,
  },
  {
    id: 'princess-islands', nameAr: 'جزر الأميرات', nameEn: 'PRINCESS ISLANDS', nameTr: 'PRENSES ADALARI',
    descriptionAr: 'عطر نسائي منعش يحمل نسيم جزر الأميرات',
    descriptionEn: 'A refreshing feminine fragrance carrying the breeze of the Princess Islands',
    descriptionTr: "Prenses Adaları'nın esintisini taşıyan ferahlatıcı bir kadın parfümü",
    category: 'women', price50ml: 340, price100ml: 530, imageUrl: '/bottle-gold.png',
    inspiredBy: 'Lancôme', originalPerfume: 'LA VIE EST BELLE',
    notesTopAr: 'خوخ، فريزيا', notesTopEn: 'Peach, Freesia', notesTopTr: 'Şeftali, Frezya',
    notesMiddleAr: 'بيوني، مغنوليا', notesMiddleEn: 'Peony, Magnolia', notesMiddleTr: 'Şakayık, Manolya',
    notesBaseAr: 'مسك أبيض، أخشاب', notesBaseEn: 'White Musk, Woods', notesBaseTr: 'Beyaz Misk, Odunsu',
    featured: true, active: true, sortOrder: 4,
  },
  {
    id: 'topkapi', nameAr: 'توبكابي', nameEn: 'TOPKAPI', nameTr: 'TOPKAPI',
    descriptionAr: 'عطر رجالي ملكي مستوحى من قصر توبكابي العريق',
    descriptionEn: 'A regal masculine fragrance inspired by the historic Topkapi Palace',
    descriptionTr: "Tarihi Topkapı Sarayı'ndan ilham alan asil bir erkek parfümü",
    category: 'men', price50ml: 400, price100ml: 650, imageUrl: '/bottle-black.png',
    inspiredBy: 'Tom Ford', originalPerfume: 'OUD WOOD',
    notesTopAr: 'زعفران، هيل', notesTopEn: 'Saffron, Cardamom', notesTopTr: 'Safran, Kakule',
    notesMiddleAr: 'عود كمبودي، ورد تركي', notesMiddleEn: 'Cambodian Oud, Turkish Rose', notesMiddleTr: 'Kamboçya Udu, Türk Gülü',
    notesBaseAr: 'عنبر، بخور', notesBaseEn: 'Amber, Incense', notesBaseTr: 'Amber, Tütsü',
    featured: false, active: true, sortOrder: 5,
  },
  {
    id: 'hagia-sophia', nameAr: 'آيا صوفيا', nameEn: 'HAGIA SOPHIA', nameTr: 'AYASOFYA',
    descriptionAr: 'عطر نسائي ساحر يجمع بين الشرق والغرب كما تفعل آيا صوفيا',
    descriptionEn: 'An enchanting feminine fragrance bridging East and West, like Hagia Sophia itself',
    descriptionTr: "Ayasofya gibi Doğu ve Batı'yı birleştiren büyüleyici bir kadın parfümü",
    category: 'women', price50ml: 390, price100ml: 620, imageUrl: '/bottle-gold.png',
    inspiredBy: 'YSL', originalPerfume: 'BLACK OPIUM',
    notesTopAr: 'عنبر، بخور', notesTopEn: 'Amber, Frankincense', notesTopTr: 'Amber, Günlük',
    notesMiddleAr: 'ورد دمشقي، زنبق', notesMiddleEn: 'Damask Rose, Lily', notesMiddleTr: 'Şam Gülü, Zambak',
    notesBaseAr: 'مسك، باتشولي', notesBaseEn: 'Musk, Patchouli', notesBaseTr: 'Misk, Paçuli',
    featured: false, active: true, sortOrder: 6,
  },
  {
    id: 'nisantasi', nameAr: 'نيشانتاشي', nameEn: 'NİŞANTAŞI', nameTr: 'NİŞANTAŞI',
    descriptionAr: 'عطر رجالي مستوحى من أناقة حي نيشانتاشي الراقي',
    descriptionEn: 'A masculine scent inspired by the elegance of the upscale Nişantaşı district',
    descriptionTr: "Şık Nişantaşı semtinin zarafetinden ilham alan bir erkek kokusu",
    category: 'men', price50ml: 360, price100ml: 570, imageUrl: '/bottle-black.png',
    inspiredBy: 'Versace', originalPerfume: 'EROS',
    notesTopAr: 'جريب فروت، بيرغاموت', notesTopEn: 'Grapefruit, Bergamot', notesTopTr: 'Greyfurt, Bergamot',
    notesMiddleAr: 'جنزبيل، حبهان', notesMiddleEn: 'Ginger, Cardamom', notesMiddleTr: 'Zencefil, Kakule',
    notesBaseAr: 'عنبر، خشب الصندل', notesBaseEn: 'Amber, Sandalwood', notesBaseTr: 'Amber, Sandal Ağacı',
    featured: false, active: true, sortOrder: 7,
  },
  {
    id: 'karakoy', nameAr: 'قراقوي', nameEn: 'KARAKÖY', nameTr: 'KARAKÖY',
    descriptionAr: 'عطر نسائي ساحر يعكس مزيج الفن والحياة في قراقوي',
    descriptionEn: 'A captivating feminine scent reflecting the art and life of Karaköy',
    descriptionTr: "Karaköy'ün sanat ve yaşamını yansıtan büyüleyici bir kadın kokusu",
    category: 'women', price50ml: 355, price100ml: 560, imageUrl: '/bottle-gold.png',
    inspiredBy: 'Gucci', originalPerfume: 'BLOOM',
    notesTopAr: 'توت أحمر، تفاح', notesTopEn: 'Red Berry, Apple', notesTopTr: 'Kırmızı Meyve, Elma',
    notesMiddleAr: 'ورد، فاوانيا', notesMiddleEn: 'Rose, Peony', notesMiddleTr: 'Gül, Şakayık',
    notesBaseAr: 'مسك، أخشاب', notesBaseEn: 'Musk, Woods', notesBaseTr: 'Misk, Odun',
    featured: false, active: true, sortOrder: 8,
  },
  {
    id: 'besiktas', nameAr: 'بيشكتاش', nameEn: 'BEŞİKTAŞ', nameTr: 'BEŞİKTAŞ',
    descriptionAr: 'عطر رجالي جريء مستوحى من روح بيشكتاش',
    descriptionEn: 'A bold masculine fragrance inspired by the vibrant spirit of Beşiktaş',
    descriptionTr: "Beşiktaş'ın canlı ruhundan ilham alan cesur bir erkek parfümü",
    category: 'men', price50ml: 330, price100ml: 520, imageUrl: '/bottle-black.png',
    inspiredBy: 'Paco Rabanne', originalPerfume: '1 MILLION',
    notesTopAr: 'ليمون، توت أسود', notesTopEn: 'Lemon, Blackcurrant', notesTopTr: 'Limon, Siyah Frenk Üzümü',
    notesMiddleAr: 'قرفة، باتشولي', notesMiddleEn: 'Cinnamon, Patchouli', notesMiddleTr: 'Tarçın, Paçuli',
    notesBaseAr: 'فانيلا، لبان', notesBaseEn: 'Vanilla, Labdanum', notesBaseTr: 'Vanilya, Labdanum',
    featured: false, active: true, sortOrder: 9,
  },
  {
    id: 'ortakoy', nameAr: 'أورتاكوي', nameEn: 'ORTAKÖY', nameTr: 'ORTAKÖY',
    descriptionAr: 'عطر نسائي رومانسي يعكس سحر كورنيش أورتاكوي',
    descriptionEn: 'A romantic feminine fragrance reflecting the charm of the Ortaköy promenade',
    descriptionTr: "Ortaköy sahilinin büyüsünü yansıtan romantik bir kadın parfümü",
    category: 'women', price50ml: 370, price100ml: 580, imageUrl: '/bottle-gold.png',
    inspiredBy: 'Viktor & Rolf', originalPerfume: 'FLOWERBOMB',
    notesTopAr: 'برتقال، مندرين', notesTopEn: 'Orange, Mandarin', notesTopTr: 'Portakal, Mandalina',
    notesMiddleAr: 'ورد، ياسمين', notesMiddleEn: 'Rose, Jasmine', notesMiddleTr: 'Gül, Yasemin',
    notesBaseAr: 'مسك، خشب الصندل', notesBaseEn: 'Musk, Sandalwood', notesBaseTr: 'Misk, Sandal Ağacı',
    featured: false, active: true, sortOrder: 10,
  },
  {
    id: 'uskudar', nameAr: 'أوسكودار', nameEn: 'ÜSKÜDAR', nameTr: 'ÜSKÜDAR',
    descriptionAr: 'عطر رجالي كلاسيكي مستوحى من هدوء أوسكودار العريقة',
    descriptionEn: 'A classic masculine fragrance inspired by the tranquil timelessness of Üsküdar',
    descriptionTr: "Üsküdar'ın sakin zamansızlığından ilham alan klasik bir erkek parfümü",
    category: 'men', price50ml: 345, price100ml: 545, imageUrl: '/bottle-black.png',
    inspiredBy: 'Armani', originalPerfume: 'ACQUA DI GIÒ',
    notesTopAr: 'خضار بحري، ليمون', notesTopEn: 'Marine, Lemon', notesTopTr: 'Deniz Notası, Limon',
    notesMiddleAr: 'ورد، نيرولي', notesMiddleEn: 'Rose, Neroli', notesMiddleTr: 'Gül, Neroli',
    notesBaseAr: 'خشب الصندل، مسك', notesBaseEn: 'Sandalwood, Musk', notesBaseTr: 'Sandal Ağacı, Misk',
    featured: false, active: true, sortOrder: 11,
  },
  {
    id: 'bebek', nameAr: 'بيبك', nameEn: 'BEBEK', nameTr: 'BEBEK',
    descriptionAr: 'عطر نسائي راقٍ يعكس أناقة حي بيبك الفاخر',
    descriptionEn: 'A refined feminine fragrance reflecting the elegance of the upscale Bebek neighbourhood',
    descriptionTr: "Şık Bebek semtinin zarafetini yansıtan rafine bir kadın parfümü",
    category: 'women', price50ml: 395, price100ml: 630, imageUrl: '/bottle-gold.png',
    inspiredBy: 'Carolina Herrera', originalPerfume: 'GOOD GIRL',
    notesTopAr: 'بيرغاموت، ليمون', notesTopEn: 'Bergamot, Lemon', notesTopTr: 'Bergamot, Limon',
    notesMiddleAr: 'زهر الياسمين، عنبر', notesMiddleEn: 'Jasmine, Iris', notesMiddleTr: 'Yasemin, İris',
    notesBaseAr: 'مسك، خشب الصندل', notesBaseEn: 'Musk, Cedarwood', notesBaseTr: 'Misk, Sedir Ağacı',
    featured: false, active: true, sortOrder: 12,
  },
];

const defaultSettings = [
  { key: 'logoText', value: 'ARJWAN' },
  { key: 'logoSubtext', value: 'Istanbul' },
  { key: 'whatsappNumber', value: '905000000000' },
  { key: 'instagramHandle', value: 'arjwanistanbul' },
  { key: 'heroBackground', value: '' },
  { key: 'brandStoryBackground', value: '' },
  { key: 'contactEmail', value: '' },
  { key: 'customLogoUrl', value: '' },
];

async function seed() {
  console.log('Seeding database…');

  const adminPassword = 'arjwan2024';
  const hash = await bcrypt.hash(adminPassword, 10);
  await db.insert(adminUsers).values({ username: 'admin', passwordHash: hash })
    .onConflictDoNothing();
  console.log(`Admin created: admin / ${adminPassword}`);

  for (const p of initialPerfumes) {
    await db.insert(perfumes).values(p as any).onConflictDoNothing();
  }
  console.log(`Seeded ${initialPerfumes.length} perfumes.`);

  for (const s of defaultSettings) {
    await db.insert(siteSettings).values({ key: s.key, value: s.value, updatedAt: new Date() })
      .onConflictDoNothing();
  }
  console.log('Seeded site settings.');

  console.log('Done!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
