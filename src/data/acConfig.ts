export const acConfig = {
  lastUpdated: "2026-07-04",
  baseBtuPerM2: 550,
  extraPersonBtu: 400,
  sunlightFactors: {
    rendah: 0.95,
    normal: 1,
    tinggi: 1.15
  },
  roomTypeFactors: {
    "kamar tidur": 1,
    "ruang keluarga": 1.05,
    "kantor kecil": 1.08,
    "dapur ringan": 1.15
  },
  heatDeviceFactors: {
    rendah: 1,
    sedang: 1.07,
    tinggi: 1.12
  },
  topFloorFactor: 1.1,
  pkTable: [
    { pk: "1/2 PK", btu: 5000 },
    { pk: "3/4 PK", btu: 7000 },
    { pk: "1 PK", btu: 9000 },
    { pk: "1,5 PK", btu: 12000 },
    { pk: "2 PK", btu: 18000 },
    { pk: "2,5 PK", btu: 24000 }
  ]
};
