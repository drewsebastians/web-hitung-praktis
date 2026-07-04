import { useMemo, useState } from "react";
import { AppIcon } from "../components/Icon";
import { CalculatorCard, CategoryCard } from "../components/Cards";
import { categories, calculators, getCalculatorsByCategory } from "../data/calculators";
import { usePageMeta } from "../utils/seo";

export function HomePage() {
  const [query, setQuery] = useState("");
  usePageMeta("HitungPraktis - Kalkulator Harian Indonesia", "Kalkulator sederhana untuk rumah, belanja, dan usaha kecil.", "/");

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return calculators;
    return calculators.filter((calculator) =>
      [calculator.title, calculator.description, calculator.category, ...calculator.keywords].join(" ").toLowerCase().includes(text)
    );
  }, [query]);

  return (
    <>
      <section className="home-hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Kalkulator praktis</div>
            <h1>HitungPraktis</h1>
            <p>Kalkulator sederhana untuk rumah, belanja, dan usaha kecil.</p>
          </div>
          <div className="finder" role="search">
            <label htmlFor="calculator-search">Cari kalkulator</label>
            <div className="input-wrap">
              <AppIcon name="search" size={18} />
              <input
                id="calculator-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Contoh: listrik, cat, margin"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container home-section">
        <div className="section-heading">
          <h2>Pilih Kategori</h2>
          <p>Mulai dari kebutuhan paling dekat: rumah, belanja ukuran, atau hitungan usaha kecil.</p>
        </div>
        <div className="card-grid category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} count={getCalculatorsByCategory(category.id).length} />
          ))}
        </div>
      </section>
      <section className="container home-section">
        <div className="section-heading">
          <h2>{query ? "Hasil Pencarian" : "Kalkulator Utama"}</h2>
          <p>{query ? `${filtered.length} kalkulator cocok dengan pencarian.` : "Lima kalkulator awal siap dipakai dan akan terus mudah ditambah."}</p>
        </div>
        <div className="card-grid">
          {filtered.map((calculator) => (
            <CalculatorCard key={calculator.id} calculator={calculator} />
          ))}
        </div>
        {filtered.length === 0 ? <p className="empty-state">Belum ada kalkulator yang cocok. Coba kata kunci lain.</p> : null}
      </section>
      <section className="trust-band">
        <div className="container trust-grid">
          <div>
            <h2>Dibuat untuk hitungan yang jelas</h2>
            <p>HitungPraktis menampilkan rumus, contoh, dan catatan batasan agar hasil lebih mudah dipahami.</p>
          </div>
          <ul className="check-list">
            <li>
              <AppIcon name="check" /> Tanpa login
            </li>
            <li>
              <AppIcon name="check" /> Input tidak disimpan di server
            </li>
            <li>
              <AppIcon name="check" /> Semua kalkulasi berjalan di browser
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
