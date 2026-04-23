import csv, sys, io, json, re, ast
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

IMAGE_URL = "https://zsdlifnvprnadznustgt.supabase.co/storage/v1/object/public/perfume-images/WhatsApp%20Image%202026-04-23%20at%2011.38.04.jpeg"

def get_price(cost):
    if cost < 70:   return (360, 600)
    elif cost < 130: return (500, 750)
    elif cost < 145: return (550, 820)
    elif cost < 200: return (750, 1000)
    elif cost < 250: return (880, 1130)
    else:            return (880, 1200)

def make_id(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def parse_notes_from_desc(desc):
    top, mid, base = '', '', ''
    m = re.search(r'[Tt]op notes? (?:are|is|include[s]?) ([^;]+)', desc)
    if m: top = m.group(1).strip().rstrip('.')
    m = re.search(r'[Mm]iddle notes? (?:are|is|include[s]?) ([^;]+)', desc)
    if m: mid = m.group(1).strip().rstrip('.')
    m = re.search(r'[Bb]ase notes? (?:are|is|include[s]?) ([^;\.]+)', desc)
    if m: base = m.group(1).strip().rstrip('.')
    return top, mid, base

def clean_desc(raw):
    # Remove "X by Brand is a ... fragrance for men. X was launched in YYYY."
    d = re.sub(r'^.*?is an? [\w\s]+ fragrance for [\w\s]+\.', '', raw).strip()
    d = re.sub(r'^.*?was launched in \d{4}\.?\s*', '', d).strip()
    if not d or len(d) < 30:
        d = raw
    # Keep only up to the end of base notes sentence
    if 'base notes' in d.lower():
        m = re.search(r'base notes? (?:are|is)[^\.]+\.', d, re.IGNORECASE)
        if m: d = d[:m.end()].strip()
    if len(d) > 350:
        d = d[:350].rsplit(' ', 1)[0] + '...'
    return d.strip()

# Load fragrantica
fra_data = {}
with open(r'C:\Users\yosef\Downloads\arjwan-istanbul\fra_perfumes.csv', encoding='utf-8', errors='replace') as f:
    for row in csv.DictReader(f):
        fra_data[row['Name'].strip().lower()] = row

def find_fra(name, brand):
    # Exact: "Name Brandfor gender"
    for k, v in fra_data.items():
        brand_slug = brand.lower().replace('&', '').replace('  ', ' ')
        if k.startswith(name.lower()) and brand_slug in k:
            return v
    # Partial name match
    for k, v in fra_data.items():
        if k.startswith(name.lower() + ' ') or k == name.lower():
            return v
    return None

def parse_accords(s):
    try:
        return ast.literal_eval(s)[:5]
    except:
        return []

# ---- PERFUME LIST ----
perfumes = [
    # MEN
    ("1 Million Elixir", "Paco Rabanne", 77, "men"),
    ("1 Million Lucky", "Paco Rabanne", 72, "men"),
    ("1 Million", "Paco Rabanne", 51, "men"),
    ("1 Million Prive", "Paco Rabanne", 74, "men"),
    ("1 Million Royal", "Paco Rabanne", 70, "men"),
    ("212 Men", "Carolina Herrera", 66, "men"),
    ("212 VIP Black", "Carolina Herrera", 87, "men"),
    ("Bleu de Chanel", "Chanel", 75, "men"),
    ("Bleu de Chanel Parfum", "Chanel", 71, "men"),
    ("Allure Homme Sport", "Chanel", 71, "men"),
    ("Acqua Di Gio", "Giorgio Armani", 48, "men"),
    ("Acqua Di Gio Profondo", "Giorgio Armani", 65, "men"),
    ("Acqua Di Gio Profumo", "Giorgio Armani", 86, "men"),
    ("Armani Code", "Giorgio Armani", 69, "men"),
    ("Armani Code Profumo", "Giorgio Armani", 75, "men"),
    ("Stronger With You", "Giorgio Armani", 71, "men"),
    ("Stronger With You Intensely", "Giorgio Armani", 69, "men"),
    ("Boss Bottled", "Hugo Boss", 66, "men"),
    ("Boss Bottled Night", "Hugo Boss", 75, "men"),
    ("Boss The Scent", "Hugo Boss", 81, "men"),
    ("Sauvage", "Dior", 74, "men"),
    ("Sauvage Elixir", "Dior", 87, "men"),
    ("Dior Homme Intense", "Dior", 96, "men"),
    ("Fahrenheit", "Dior", 81, "men"),
    ("Eros", "Versace", 75, "men"),
    ("Eros Flame", "Versace", 79, "men"),
    ("Versace Pour Homme Dylan Blue", "Versace", 72, "men"),
    ("Versace Man Eau Fraiche", "Versace", 71, "men"),
    ("Versace Pour Homme", "Versace", 81, "men"),
    ("Invictus", "Paco Rabanne", 70, "men"),
    ("Invictus Intense", "Paco Rabanne", 80, "men"),
    ("Invictus Legend", "Paco Rabanne", 69, "men"),
    ("Invictus Platinum", "Paco Rabanne", 75, "men"),
    ("Invictus Victory Elixir", "Paco Rabanne", 75, "men"),
    ("Phantom", "Paco Rabanne", 83, "men"),
    ("Le Male", "Jean Paul Gaultier", 69, "men"),
    ("Le Male Elixir", "Jean Paul Gaultier", 75, "men"),
    ("Ultra Male", "Jean Paul Gaultier", 75, "men"),
    ("Scandal Pour Homme", "Jean Paul Gaultier", 84, "men"),
    ("Y", "Yves Saint Laurent", 75, "men"),
    ("L'Homme Le Parfum", "Yves Saint Laurent", 85, "men"),
    ("Y Elixir", "Yves Saint Laurent", 77, "men"),
    ("La Nuit de l'Homme", "Yves Saint Laurent", 84, "men"),
    ("MYSLF", "Yves Saint Laurent", 75, "men"),
    ("Black Orchid", "Tom Ford", 78, "men"),
    ("Grey Vetiver", "Tom Ford", 102, "men"),
    ("Tobacco Vanille", "Tom Ford", 113, "men"),
    ("Tuscan Leather", "Tom Ford", 81, "men"),
    ("Terre d'Hermes", "Hermes", 78, "men"),
    ("H24", "Hermes", 93, "men"),
    ("Voyage d'Hermes", "Hermes", 74, "men"),
    ("Aventus", "Creed", 72, "men"),
    ("Green Irish Tweed", "Creed", 93, "men"),
    ("Silver Mountain Water", "Creed", 78, "men"),
    ("Luna Rossa Black", "Prada", 75, "men"),
    ("Luna Rossa Carbon", "Prada", 70, "men"),
    ("Luna Rossa Ocean", "Prada", 80, "men"),
    ("Prada L'Homme", "Prada", 78, "men"),
    ("Hacivat", "Nishane", 86, "men"),
    ("L'Homme Ideal", "Guerlain", 69, "men"),
    ("Layton", "Parfums de Marly", 84, "men"),
    ("Pegasus", "Parfums de Marly", 82, "men"),
    ("Bvlgari Man In Black", "Bvlgari", 80, "men"),
    ("Light Blue Men", "Dolce & Gabbana", 71, "men"),
    ("Gentleman", "Givenchy", 72, "men"),
    ("Spicebomb", "Viktor&Rolf", 72, "men"),
    ("Explorer", "Montblanc", 81, "men"),
    ("Legend", "Montblanc", 87, "men"),
    ("Legend Night", "Montblanc", 81, "men"),
    ("Polo Blue", "Ralph Lauren", 63, "men"),
    ("Chrome", "Azzaro", 60, "men"),
    ("Wanted", "Azzaro", 81, "men"),
    ("Wanted by Night", "Azzaro", 78, "men"),
    ("Cool Water", "Davidoff", 69, "men"),
    ("Horizon", "Davidoff", 75, "men"),
    ("Declaration", "Cartier", 84, "men"),
    ("Bad Boy", "Carolina Herrera", 77, "men"),
    ("CH Men", "Carolina Herrera", 74, "men"),
    ("Kenzo Men", "Kenzo", 74, "men"),
    ("Joop! Homme", "Joop!", 72, "men"),
    ("Hero", "Burberry", 90, "men"),
    ("Issey Miyake for Men", "Issey Miyake", 62, "men"),
    ("Valentino Uomo Born in Roma", "Valentino", 144, "men"),
    ("Valentino Uomo Noir Absolu", "Valentino", 84, "men"),
    ("Versace Pour Homme Dylan Blue", "Versace", 72, "men"),
    ("Pi", "Givenchy", 75, "men"),
    ("Pasha de Cartier", "Cartier", 80, "men"),
    ("Pacific Chill", "Louis Vuitton", 90, "men"),
    ("Imagination", "Louis Vuitton", 89, "men"),
    ("Ombre Nomade Men", "Louis Vuitton", 235, "men"),
    ("Molecule 02", "Escentric Molecules", 123, "men"),
    ("Y Live", "Yves Saint Laurent", 81, "men"),
    ("Hacivat Nishane Super", "Nishane", 117, "men"),
    ("Tygar", "Bvlgari", 153, "men"),
    ("Gyan", "Bvlgari", 257, "men"),
    ("Ganymede", "Marc-Antoine Barrois", 215, "men"),
    ("Aldebaran", "Marc-Antoine Barrois", 126, "men"),

    # WOMEN
    ("Chance", "Chanel", 81, "women"),
    ("Chance Eau Fraiche", "Chanel", 78, "women"),
    ("Chance Eau Tendre", "Chanel", 74, "women"),
    ("Coco Mademoiselle", "Chanel", 81, "women"),
    ("Chanel No 5", "Chanel", 77, "women"),
    ("Miss Dior Blooming Bouquet", "Dior", 80, "women"),
    ("Miss Dior Absolutely Blooming", "Dior", 70, "women"),
    ("J'adore", "Dior", 68, "women"),
    ("Hypnotic Poison", "Dior", 66, "women"),
    ("Black Opium", "Yves Saint Laurent", 75, "women"),
    ("Libre", "Yves Saint Laurent", 83, "women"),
    ("Libre Intense", "Yves Saint Laurent", 79, "women"),
    ("Mon Paris", "Yves Saint Laurent", 74, "women"),
    ("Good Girl", "Carolina Herrera", 77, "women"),
    ("Good Girl Blush", "Carolina Herrera", 70, "women"),
    ("212 VIP Rose", "Carolina Herrera", 87, "women"),
    ("Very Good Girl", "Carolina Herrera", 81, "women"),
    ("Flowerbomb", "Viktor&Rolf", 87, "women"),
    ("La Vie Est Belle", "Lancome", 71, "women"),
    ("Idole", "Lancome", 75, "women"),
    ("Tresor Midnight Rose", "Lancome", 75, "women"),
    ("Gucci Bloom", "Gucci", 71, "women"),
    ("Flora by Gucci", "Gucci", 74, "women"),
    ("Flora Gorgeous Gardenia", "Gucci", 84, "women"),
    ("Gucci Bamboo", "Gucci", 74, "women"),
    ("Gucci Guilty Women", "Gucci", 66, "women"),
    ("Light Blue Women", "Dolce & Gabbana", 74, "women"),
    ("Bright Crystal", "Versace", 63, "women"),
    ("Bright Crystal Absolu", "Versace", 72, "women"),
    ("Eros Pour Femme", "Versace", 74, "women"),
    ("Crystal Noir", "Versace", 65, "women"),
    ("Yellow Diamond", "Versace", 75, "women"),
    ("Lady Million", "Paco Rabanne", 75, "women"),
    ("Lady Million Prive", "Paco Rabanne", 77, "women"),
    ("Lady Million Empire", "Paco Rabanne", 77, "women"),
    ("Lady Million Lucky", "Paco Rabanne", 84, "women"),
    ("Fame", "Paco Rabanne", 67, "women"),
    ("Olympea", "Paco Rabanne", 74, "women"),
    ("Si", "Giorgio Armani", 57, "women"),
    ("Si Passione", "Giorgio Armani", 77, "women"),
    ("My Way", "Giorgio Armani", 77, "women"),
    ("Acqua di Gioia", "Giorgio Armani", 75, "women"),
    ("Because It's You", "Giorgio Armani", 77, "women"),
    ("Alien", "Mugler", 59, "women"),
    ("Angel", "Mugler", 75, "women"),
    ("Alien Goddess", "Mugler", 75, "women"),
    ("Scandal", "Jean Paul Gaultier", 78, "women"),
    ("Scandal Intense", "Jean Paul Gaultier", 75, "women"),
    ("Gaultier Divine", "Jean Paul Gaultier", 80, "women"),
    ("Valentino Donna Born in Roma", "Valentino", 81, "women"),
    ("Valentino Donna", "Valentino", 81, "women"),
    ("Burberry Her", "Burberry", 84, "women"),
    ("My Burberry", "Burberry", 72, "women"),
    ("My Burberry Blush", "Burberry", 77, "women"),
    ("Delina", "Parfums de Marly", 86, "women"),
    ("Delina Exclusif", "Parfums de Marly", 86, "women"),
    ("Galloway", "Parfums de Marly", 81, "women"),
    ("Narciso Rodriguez for Her", "Narciso Rodriguez", 80, "women"),
    ("Narciso Poudree", "Narciso Rodriguez", 75, "women"),
    ("Narciso Rouge", "Narciso Rodriguez", 78, "women"),
    ("Euphoria", "Calvin Klein", 66, "women"),
    ("Eternity for Women", "Calvin Klein", 66, "women"),
    ("Omnia Crystalline", "Bvlgari", 75, "women"),
    ("Prada Candy", "Prada", 75, "women"),
    ("Prada Paradoxe", "Prada", 73, "women"),
    ("Chloe", "Chloe", 81, "women"),
    ("Love Don't Be Shy", "By Kilian", 84, "women"),
    ("Angels' Share", "By Kilian", 95, "women"),
    ("Eclat d'Arpege", "Lanvin", 65, "women"),
    ("Modern Princess", "Lanvin", 75, "women"),
    ("Nina", "Nina Ricci", 51, "women"),
    ("Attrape-Reves", "Louis Vuitton", 92, "women"),
    ("Lost Cherry", "Tom Ford", 146, "women"),
    ("Bombshell", "Victoria's Secret", 63, "women"),
    ("24 Faubourg", "Hermes", 85, "women"),
    ("Pleasures", "Estee Lauder", 90, "women"),
    ("Ange Ou Demon Le Secret", "Givenchy", 63, "women"),
    ("IRRESISTIBLE GIVENCHY", "Givenchy", 75, "women"),
    ("Cloud", "Ariana Grande", 78, "women"),
    ("Rose The One", "Dolce & Gabbana", 87, "women"),
    ("The Only One", "Dolce & Gabbana", 80, "women"),
    ("Supreme Bouquet", "Yves Saint Laurent", 84, "women"),
    ("Kirke", "Tiziana Terenzi", 86, "women"),
    ("Elie Saab", "Elie Saab", 59, "women"),
    ("Girl of Now", "Elie Saab", 71, "women"),
    ("Kenzo Flower", "Kenzo", 59, "women"),
    ("Amor Amor", "Cacharel", 58, "women"),
    ("Alien Goddess Supreme", "Mugler", 75, "women"),
    ("Hypnose", "Lancome", 70, "women"),
    ("Manifesto", "Yves Saint Laurent", 120, "women"),
    ("Lucky Wish", "Anna Sui", 126, "women"),
    ("L'Interdit", "Givenchy", 81, "women"),
    ("L'Interdit Rouge", "Givenchy", 81, "women"),
    ("Scandal Le Parfum", "Jean Paul Gaultier", 72, "women"),

    # UNISEX
    ("Baccarat Rouge 540", "Maison Francis Kurkdjian", 173, "women"),
    ("Grand Soir", "Maison Francis Kurkdjian", 117, "women"),
    ("Oud Satin Mood", "Maison Francis Kurkdjian", 74, "women"),
    ("Ombre Leather", "Tom Ford", 128, "men"),
    ("Tobacco Oud", "Tom Ford", 134, "men"),
    ("Bitter Peach", "Tom Ford", 92, "men"),
    ("Soleil Blanc", "Tom Ford", 75, "women"),
    ("Sycomore", "Chanel", 74, "women"),
    ("Halfeti", "Penhaligon's", 105, "women"),
    ("Replica Fireplace", "Maison Margiela", 87, "women"),
    ("Oud for Greatness", "Initio", 98, "women"),
    ("Side Effect", "Initio", 75, "men"),
    ("Black Phantom", "By Kilian", 80, "women"),
    ("Old Fashioned", "By Kilian", 112, "women"),
    ("Byredo Black Saffron", "Byredo", 91, "women"),
    ("Byredo Rose of No Man's Land", "Byredo", 75, "women"),
    ("Ombre Nomade", "Louis Vuitton", 235, "women"),
    ("Molecule 04", "Escentric Molecules", 221, "women"),
    ("Molecule 03", "Escentric Molecules", 87, "men"),
    ("Vanilla 28", "Kayali", 75, "women"),
    ("Bois Imperial", "Essential Parfums", 93, "women"),
    ("Cedrat Boise", "Mancera", 81, "men"),
    ("Roses Greedy", "Mancera", 75, "women"),
    ("Vanilla Rose", "Mancera", 59, "women"),
    ("Andromeda", "Tiziana Terenzi", 98, "women"),
    ("Bade'e Al Oud for Glory", "Lattafa", 84, "men"),
    ("Khamrah", "Lattafa", 80, "women"),
    ("African Leather", "Memo Paris", 92, "men"),
    ("Bal d'Afrique", "Byredo", 86, "men"),
    ("Cherry Smoke", "Tom Ford", 136, "men"),
    ("Arabians Tonka", "Montale", 80, "men"),
    ("Dark Purple", "Montale", 77, "women"),
    ("Aoud Queen Roses", "Montale", 75, "women"),
    ("Patchouli Absolu", "Tom Ford", 107, "men"),
    ("Hacivat Nishane Unisex", "Nishane", 86, "women"),
    ("Ani", "Nishane", 75, "women"),
    ("Alexanderia II", "Xerjoff", 85, "men"),
    ("XJ 1861 Naxos", "Xerjoff", 75, "men"),
    ("Gucci Oud Intense", "Gucci", 86, "men"),
    ("Oud Wood Tom Ford", "Tom Ford", 120, "men"),
]

products = []
seen_ids = set()

for (name, brand, cost, category) in perfumes:
    pid = make_id(name)
    if pid in seen_ids:
        pid = make_id(f"{name}-{brand}")
    seen_ids.add(pid)
    
    p50, p100 = get_price(cost)
    fra = find_fra(name, brand)
    
    if fra and fra.get('Description', '').strip():
        raw = fra['Description']
        desc_en = clean_desc(raw)
        top, mid, base = parse_notes_from_desc(raw)
        accords = parse_accords(fra.get('Main Accords', '[]'))
        if not desc_en or len(desc_en) < 30:
            desc_en = f"A captivating {brand} fragrance with {', '.join(accords[:3])} character."
    else:
        fra = None
    
    if not fra:
        desc_en = f"A captivating fragrance by {brand}, crafted with exceptional ingredients for a memorable experience."
        top, mid, base = '', '', ''
        accords = []

    product = {
        "id": pid,
        "name": {"ar": name, "en": name, "tr": name},
        "description": {"ar": desc_en, "en": desc_en, "tr": desc_en},
        "category": category,
        "price50ml": p50,
        "price100ml": p100,
        "image": IMAGE_URL,
        "inspiredBy": brand,
        "originalPerfume": name.upper(),
        "notes": {
            "top": {"ar": top, "en": top, "tr": top},
            "middle": {"ar": mid, "en": mid, "tr": mid},
            "base": {"ar": base, "en": base, "tr": base}
        },
        "featured": False,
    }
    products.append(product)

sys.stderr.write(f"Generated {len(products)} products\n")
print(json.dumps(products, ensure_ascii=False, indent=2))
