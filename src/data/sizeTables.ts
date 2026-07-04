export type SizeCategory = "pria" | "wanita" | "anak";
export type ShoeInputMode = "cm" | "eu" | "us" | "uk" | "jp";

export interface ShoeSizeRow {
  cm: number;
  eu: number;
  us: number;
  uk: number;
}

export const shoeSizeTables: Record<SizeCategory, ShoeSizeRow[]> = {
  pria: [
    { cm: 24, eu: 39, us: 6, uk: 5.5 },
    { cm: 24.5, eu: 39.5, us: 6.5, uk: 6 },
    { cm: 25, eu: 40, us: 7, uk: 6.5 },
    { cm: 25.5, eu: 41, us: 7.5, uk: 7 },
    { cm: 26, eu: 42, us: 8, uk: 7.5 },
    { cm: 26.5, eu: 42.5, us: 8.5, uk: 8 },
    { cm: 27, eu: 43, us: 9, uk: 8.5 },
    { cm: 27.5, eu: 44, us: 9.5, uk: 9 },
    { cm: 28, eu: 44.5, us: 10, uk: 9.5 },
    { cm: 28.5, eu: 45, us: 10.5, uk: 10 },
    { cm: 29, eu: 46, us: 11, uk: 10.5 },
    { cm: 30, eu: 47, us: 12, uk: 11.5 }
  ],
  wanita: [
    { cm: 22, eu: 35, us: 5, uk: 2.5 },
    { cm: 22.5, eu: 36, us: 5.5, uk: 3 },
    { cm: 23, eu: 36.5, us: 6, uk: 3.5 },
    { cm: 23.5, eu: 37, us: 6.5, uk: 4 },
    { cm: 24, eu: 38, us: 7, uk: 4.5 },
    { cm: 24.5, eu: 38.5, us: 7.5, uk: 5 },
    { cm: 25, eu: 39, us: 8, uk: 5.5 },
    { cm: 25.5, eu: 40, us: 8.5, uk: 6 },
    { cm: 26, eu: 41, us: 9, uk: 6.5 },
    { cm: 26.5, eu: 41.5, us: 9.5, uk: 7 },
    { cm: 27, eu: 42, us: 10, uk: 7.5 }
  ],
  anak: [
    { cm: 14, eu: 23, us: 7, uk: 6.5 },
    { cm: 15, eu: 24, us: 8, uk: 7.5 },
    { cm: 16, eu: 26, us: 9, uk: 8.5 },
    { cm: 17, eu: 27, us: 10, uk: 9.5 },
    { cm: 18, eu: 29, us: 11, uk: 10.5 },
    { cm: 19, eu: 30, us: 12, uk: 11.5 },
    { cm: 20, eu: 32, us: 13, uk: 12.5 },
    { cm: 21, eu: 33, us: 1, uk: 13.5 },
    { cm: 22, eu: 35, us: 3, uk: 2.5 },
    { cm: 23, eu: 36, us: 4, uk: 3.5 }
  ]
};

export interface ClothingSizeRow {
  size: string;
  chest: [number, number];
  waist: [number, number];
  hip?: [number, number];
  height?: [number, number];
  weight?: [number, number];
}

export const clothingSizeTables: Record<SizeCategory, ClothingSizeRow[]> = {
  pria: [
    { size: "S", chest: [86, 94], waist: [72, 80], hip: [86, 94] },
    { size: "M", chest: [94, 102], waist: [80, 88], hip: [94, 102] },
    { size: "L", chest: [102, 110], waist: [88, 96], hip: [102, 110] },
    { size: "XL", chest: [110, 118], waist: [96, 104], hip: [110, 118] },
    { size: "XXL", chest: [118, 128], waist: [104, 114], hip: [118, 128] }
  ],
  wanita: [
    { size: "S", chest: [82, 88], waist: [64, 70], hip: [88, 94] },
    { size: "M", chest: [88, 94], waist: [70, 76], hip: [94, 100] },
    { size: "L", chest: [94, 102], waist: [76, 84], hip: [100, 108] },
    { size: "XL", chest: [102, 110], waist: [84, 92], hip: [108, 116] },
    { size: "XXL", chest: [110, 120], waist: [92, 104], hip: [116, 126] }
  ],
  anak: [
    { size: "XS Anak", chest: [52, 58], waist: [48, 54], height: [100, 115], weight: [14, 20] },
    { size: "S Anak", chest: [58, 64], waist: [54, 60], height: [115, 130], weight: [20, 28] },
    { size: "M Anak", chest: [64, 70], waist: [60, 66], height: [130, 145], weight: [28, 38] },
    { size: "L Anak", chest: [70, 78], waist: [66, 72], height: [145, 158], weight: [38, 48] },
    { size: "XL Anak", chest: [78, 86], waist: [72, 80], height: [158, 168], weight: [48, 58] }
  ]
};
