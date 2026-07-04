# HitungPraktis

Kalkulator sederhana untuk rumah, belanja, dan usaha kecil. Website ini dibuat sebagai static site React + Vite + TypeScript sehingga cocok untuk GitHub Pages atau static hosting lain.

## Isi Website

- Homepage `/`
- Kategori `/rumah/`, `/belanja-ukuran/`, `/umkm/`
- Kalkulator biaya listrik PLN `/rumah/kalkulator-biaya-listrik/`
- Konverter ukuran sepatu & baju `/belanja-ukuran/konverter-ukuran-sepatu-baju/`
- Kalkulator HPP, margin, dan markup UMKM `/umkm/kalkulator-hpp-margin-markup/`
- Kalkulator kebutuhan cat tembok `/rumah/kalkulator-kebutuhan-cat-tembok/`
- Kalkulator kebutuhan AC / PK ruangan `/rumah/kalkulator-kebutuhan-ac-pk/`
- Halaman trust: `/tentang/`, `/kontak/`, `/privacy-policy/`, `/disclaimer/`
- SEO support: `public/sitemap.xml`, `public/robots.txt`, meta title, meta description, Open Graph, dan canonical URL.

## Install

```bash
pnpm install
```

## Jalankan Lokal

```bash
pnpm dev
```

## Test dan Build

```bash
pnpm test
pnpm build
```

Build menghasilkan folder `dist/`. Script build juga menyalin `index.html` ke `404.html` agar routing SPA tetap bekerja di GitHub Pages.

## Deploy ke GitHub Pages

Workflow GitHub Actions sudah tersedia di `.github/workflows/deploy.yml`.

1. Buka repo di GitHub.
2. Masuk ke Settings > Pages.
3. Pilih Source: GitHub Actions.
4. Push ke branch `main`.
5. Workflow akan menjalankan `pnpm install`, test, build dengan `GITHUB_PAGES=true`, lalu menerbitkan folder `dist`.

Untuk build manual dengan base path GitHub Pages:

```bash
GITHUB_PAGES=true pnpm build
```

Di PowerShell:

```powershell
$env:GITHUB_PAGES="true"; pnpm build
```

## Cara Menambah Kalkulator Baru

1. Buat folder baru di `src/calculators/nama-kalkulator/`.
2. Pisahkan rumus ke `logic.ts` dan UI ke komponen React.
3. Tambahkan metadata ke `src/data/calculators.ts`: `id`, judul, kategori, path, keywords, icon, related calculators, meta title, dan meta description.
4. Tambahkan mapping komponen di `src/App.tsx`.
5. Tambahkan tes formula di `src/calculators/core.test.ts`.
6. Tambahkan URL baru ke `public/sitemap.xml`.

## Tempat Mengubah Asumsi

- Tarif listrik dan preset alat: `src/data/electricityTariffs.ts`
- Tabel ukuran sepatu dan baju: `src/data/sizeTables.ts`
- Asumsi cat tembok: `src/data/paintConfig.ts`
- Referensi BTU dan PK AC: `src/data/acConfig.ts`
- Metadata kalkulator, kategori, related links, dan SEO: `src/data/calculators.ts`

Nilai tarif atau asumsi yang bisa berubah diberi `lastUpdated`. Verifikasi ulang ke sumber resmi sebelum publikasi besar atau setelah ada perubahan kebijakan.

## Checklist Sebelum Publikasi

- Jalankan `pnpm test`.
- Jalankan `pnpm build`.
- Coba halaman utama dan semua route kalkulator.
- Cek tampilan mobile, tablet, dan desktop.
- Pastikan nilai tarif/asumsi sudah sesuai sumber terbaru.
- Pastikan halaman Tentang, Kontak, Privacy Policy, dan Disclaimer tidak kosong.
