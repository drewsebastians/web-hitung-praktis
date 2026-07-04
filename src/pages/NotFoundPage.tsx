import { CalculatorCard } from "../components/Cards";
import { calculators } from "../data/calculators";
import { usePageMeta } from "../utils/seo";

export function NotFoundPage() {
  usePageMeta("Halaman Tidak Ditemukan - HitungPraktis", "Halaman yang dicari tidak tersedia.", "/404/");
  return (
    <section className="container page-header">
      <div className="eyebrow">404</div>
      <h1>Halaman tidak ditemukan</h1>
      <p>Alamat yang dibuka belum tersedia. Pilih salah satu kalkulator utama di bawah ini.</p>
      <div className="card-grid">
        {calculators.map((calculator) => (
          <CalculatorCard key={calculator.id} calculator={calculator} />
        ))}
      </div>
    </section>
  );
}
