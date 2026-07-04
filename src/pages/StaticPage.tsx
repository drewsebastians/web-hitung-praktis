import { Breadcrumbs } from "../components/Breadcrumbs";
import { usePageMeta } from "../utils/seo";

const content = {
  "/tentang/": {
    title: "Tentang HitungPraktis",
    description: "Tentang HitungPraktis dan cara situs ini membantu hitungan sehari-hari.",
    body: [
      "HitungPraktis adalah website kalkulator sederhana untuk kebutuhan rumah, belanja, dan usaha kecil. Situs ini dibuat agar pengguna Indonesia bisa menghitung estimasi dengan cepat tanpa login.",
      "Rumus ditulis secara transparan pada setiap halaman kalkulator. Jika ada asumsi yang bisa berubah, seperti tarif atau daya sebar cat, nilainya ditempatkan di file konfigurasi agar mudah diperbarui.",
      "Semua perhitungan berjalan di browser pengguna. HitungPraktis tidak membutuhkan akun dan tidak mengirim input kalkulator ke server."
    ]
  },
  "/kontak/": {
    title: "Kontak",
    description: "Hubungi pengelola HitungPraktis untuk masukan dan koreksi.",
    body: [
      "Untuk masukan, koreksi asumsi, atau usulan kalkulator baru, silakan hubungi pengelola melalui kanal yang tersedia di profil GitHub pemilik situs.",
      "Jika melaporkan hasil yang terasa tidak tepat, sertakan halaman kalkulator, input yang digunakan, dan hasil yang muncul agar bisa diperiksa dengan jelas."
    ]
  },
  "/privacy-policy/": {
    title: "Privacy Policy",
    description: "Kebijakan privasi HitungPraktis.",
    body: [
      "HitungPraktis tidak meminta pengguna membuat akun dan tidak menyimpan input kalkulator pada server aplikasi.",
      "Perhitungan dilakukan secara lokal di browser. Jika di masa depan situs memakai analitik atau iklan, layanan tersebut dapat memproses data teknis umum seperti perangkat, browser, halaman yang dikunjungi, dan alamat IP sesuai kebijakan masing-masing layanan.",
      "Pengguna dapat menutup halaman kapan saja tanpa meninggalkan data kalkulator di sistem HitungPraktis."
    ]
  },
  "/disclaimer/": {
    title: "Disclaimer",
    description: "Batasan penggunaan hasil kalkulator HitungPraktis.",
    body: [
      "Hasil di HitungPraktis adalah estimasi praktis, bukan nasihat profesional, akuntansi, pajak, hukum, teknik bangunan, atau rekomendasi resmi dari penyedia produk.",
      "Nilai aktual bisa berbeda karena tarif berubah, kebiasaan penggunaan, kondisi ruangan, efisiensi alat, kebijakan marketplace, ukuran brand, dan faktor lain yang tidak selalu bisa dihitung otomatis.",
      "Gunakan hasil sebagai bahan pertimbangan awal dan cek sumber resmi atau tenaga ahli saat keputusan memiliki risiko biaya besar."
    ]
  }
} as const;

export function StaticPage({ path }: { path: string }) {
  const page = content[path as keyof typeof content] ?? content["/tentang/"];
  usePageMeta(`${page.title} - HitungPraktis`, page.description, path);

  return (
    <section className="container page-header narrow-page">
      <Breadcrumbs items={[{ label: page.title }]} />
      <div className="eyebrow">Informasi</div>
      <h1>{page.title}</h1>
      {page.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  );
}
