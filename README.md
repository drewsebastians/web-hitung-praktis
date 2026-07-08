# HitungPraktis

Kalkulator sederhana untuk rumah, belanja, dan usaha kecil. Website ini dibuat sebagai static site React + Vite + TypeScript dan saat ini ditargetkan untuk Cloudflare Pages.

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

Build menghasilkan folder `dist/`. Script build juga menyalin `index.html` ke setiap route bersih agar URL seperti `/rumah/kalkulator-biaya-listrik/` bisa dilayani sebagai halaman statis.

## Deploy ke Cloudflare Pages

Repo ini siap dipakai di Cloudflare Pages dengan pengaturan berikut:

- Framework preset: Vite
- Build command: `pnpm build`
- Build output directory: `dist`
- Root directory: `/`
- Node version: `24`
- Package manager: `pnpm@11.7.0`

File `wrangler.toml` juga menyatakan output Pages di `dist`. Setiap push ke branch `main` akan memicu deployment Cloudflare Pages jika repo sudah terhubung di dashboard Cloudflare.

Domain default yang dipakai untuk canonical URL dan sitemap adalah `https://web-hitung-praktis.pages.dev/`. Jika memakai custom domain, update `src/utils/routes.ts`, `public/robots.txt`, dan `public/sitemap.xml`.

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


