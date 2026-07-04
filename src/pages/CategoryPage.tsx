import { Breadcrumbs } from "../components/Breadcrumbs";
import { CalculatorCard } from "../components/Cards";
import { CategoryMeta, getCalculatorsByCategory } from "../data/calculators";
import { usePageMeta } from "../utils/seo";

export function CategoryPage({ category }: { category: CategoryMeta }) {
  const items = getCalculatorsByCategory(category.id);
  usePageMeta(`${category.title} - HitungPraktis`, category.description, category.path);

  return (
    <section className="container page-header">
      <Breadcrumbs items={[{ label: category.shortTitle }]} />
      <div className="eyebrow">Kategori</div>
      <h1>{category.title}</h1>
      <p>{category.description}</p>
      <div className="card-grid">
        {items.map((calculator) => (
          <CalculatorCard key={calculator.id} calculator={calculator} />
        ))}
      </div>
      <div className="content-section">
        <h2>Kenapa kategori ini berguna?</h2>
        <p>
          Setiap kalkulator dibuat untuk membantu keputusan sehari-hari dengan rumus yang terbuka. Hasilnya tetap estimasi,
          tetapi cukup praktis untuk membandingkan pilihan sebelum membeli, merenovasi, atau menentukan harga.
        </p>
      </div>
    </section>
  );
}
