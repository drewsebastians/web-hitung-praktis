export type CalculatorCategoryId = "rumah" | "belanja-ukuran" | "umkm";

export interface CategoryMeta {
  id: CalculatorCategoryId;
  title: string;
  shortTitle: string;
  description: string;
  path: string;
  iconName: "home" | "shopping-bag" | "store";
}

export interface CalculatorMeta {
  id: "biaya-listrik" | "ukuran-sepatu-baju" | "hpp-margin-markup" | "cat-tembok" | "ac-pk";
  title: string;
  shortTitle: string;
  description: string;
  category: CalculatorCategoryId;
  path: string;
  keywords: string[];
  iconName: "zap" | "shirt" | "calculator" | "paintbrush" | "snowflake";
  relatedIds: CalculatorMeta["id"][];
  metaTitle: string;
  metaDescription: string;
}

export const categories: CategoryMeta[] = [
  {
    id: "rumah",
    title: "Kalkulator Rumah",
    shortTitle: "Rumah",
    description: "Hitung kebutuhan sehari-hari di rumah, mulai dari listrik, cat tembok, sampai kapasitas AC.",
    path: "/rumah/",
    iconName: "home"
  },
  {
    id: "belanja-ukuran",
    title: "Belanja & Ukuran",
    shortTitle: "Belanja & Ukuran",
    description: "Bantu cek ukuran sepatu dan baju sebelum belanja online agar pilihan lebih percaya diri.",
    path: "/belanja-ukuran/",
    iconName: "shopping-bag"
  },
  {
    id: "umkm",
    title: "Kalkulator UMKM",
    shortTitle: "UMKM",
    description: "Alat bantu sederhana untuk menghitung HPP, margin, markup, dan dampak promo usaha kecil.",
    path: "/umkm/",
    iconName: "store"
  }
];

export const calculators: CalculatorMeta[] = [
  {
    id: "biaya-listrik",
    title: "Kalkulator Biaya Listrik PLN",
    shortTitle: "Biaya Listrik PLN",
    description: "Estimasi kWh dan biaya listrik dari daya alat, lama pemakaian, dan tarif per kWh.",
    category: "rumah",
    path: "/rumah/kalkulator-biaya-listrik/",
    keywords: ["listrik", "PLN", "kWh", "rumah", "tarif"],
    iconName: "zap",
    relatedIds: ["ac-pk", "cat-tembok"],
    metaTitle: "Kalkulator Biaya Listrik PLN - HitungPraktis",
    metaDescription: "Hitung estimasi biaya listrik PLN per hari, bulan, dan tahun dari watt alat elektronik, jam pakai, dan tarif kWh."
  },
  {
    id: "ukuran-sepatu-baju",
    title: "Konverter Ukuran Sepatu & Baju",
    shortTitle: "Ukuran Sepatu & Baju",
    description: "Konversi ukuran sepatu EU, US, UK, JP/CM dan rekomendasi ukuran baju umum.",
    category: "belanja-ukuran",
    path: "/belanja-ukuran/konverter-ukuran-sepatu-baju/",
    keywords: ["ukuran", "sepatu", "baju", "size chart", "belanja"],
    iconName: "shirt",
    relatedIds: ["hpp-margin-markup"],
    metaTitle: "Konverter Ukuran Sepatu & Baju - HitungPraktis",
    metaDescription: "Konversi ukuran sepatu dan cek rekomendasi ukuran baju umum untuk membantu belanja online."
  },
  {
    id: "hpp-margin-markup",
    title: "Kalkulator HPP, Margin, dan Markup UMKM",
    shortTitle: "HPP, Margin, Markup",
    description: "Hitung HPP per unit, harga jual, laba kotor, margin, markup, dan dampak diskon.",
    category: "umkm",
    path: "/umkm/kalkulator-hpp-margin-markup/",
    keywords: ["HPP", "margin", "markup", "UMKM", "harga jual"],
    iconName: "calculator",
    relatedIds: ["biaya-listrik"],
    metaTitle: "Kalkulator HPP, Margin, dan Markup UMKM - HitungPraktis",
    metaDescription: "Hitung HPP, harga jual, laba kotor, margin, markup, dan simulasi diskon untuk usaha kecil."
  },
  {
    id: "cat-tembok",
    title: "Kalkulator Kebutuhan Cat Tembok",
    shortTitle: "Kebutuhan Cat Tembok",
    description: "Estimasi luas dinding, liter cat, dan jumlah kaleng berdasarkan ukuran ruangan.",
    category: "rumah",
    path: "/rumah/kalkulator-kebutuhan-cat-tembok/",
    keywords: ["cat tembok", "liter cat", "rumah", "renovasi"],
    iconName: "paintbrush",
    relatedIds: ["biaya-listrik", "ac-pk"],
    metaTitle: "Kalkulator Kebutuhan Cat Tembok - HitungPraktis",
    metaDescription: "Hitung estimasi liter cat dan jumlah kaleng yang dibutuhkan berdasarkan ukuran ruangan, lapisan cat, dan daya sebar."
  },
  {
    id: "ac-pk",
    title: "Kalkulator Kebutuhan AC / PK Ruangan",
    shortTitle: "Kebutuhan AC / PK",
    description: "Perkirakan kebutuhan BTU dan rekomendasi PK AC berdasarkan luas dan kondisi ruangan.",
    category: "rumah",
    path: "/rumah/kalkulator-kebutuhan-ac-pk/",
    keywords: ["AC", "PK", "BTU", "ruangan", "rumah"],
    iconName: "snowflake",
    relatedIds: ["biaya-listrik", "cat-tembok"],
    metaTitle: "Kalkulator Kebutuhan AC / PK Ruangan - HitungPraktis",
    metaDescription: "Hitung estimasi BTU dan rekomendasi PK AC berdasarkan ukuran ruangan, jumlah orang, sinar matahari, dan perangkat panas."
  }
];

export function getCategory(id: CalculatorCategoryId): CategoryMeta {
  const category = categories.find((item) => item.id === id);
  if (!category) throw new Error(`Kategori tidak ditemukan: ${id}`);
  return category;
}

export function getCalculator(id: CalculatorMeta["id"]): CalculatorMeta {
  const calculator = calculators.find((item) => item.id === id);
  if (!calculator) throw new Error(`Kalkulator tidak ditemukan: ${id}`);
  return calculator;
}

export function getCalculatorsByCategory(categoryId: CalculatorCategoryId): CalculatorMeta[] {
  return calculators.filter((calculator) => calculator.category === categoryId);
}

export function getRelatedCalculators(calculator: CalculatorMeta): CalculatorMeta[] {
  const explicit = calculator.relatedIds.map(getCalculator);
  const sameCategory = calculators.filter((item) => item.category === calculator.category && item.id !== calculator.id);
  return [...new Map([...explicit, ...sameCategory].map((item) => [item.id, item])).values()].slice(0, 3);
}
