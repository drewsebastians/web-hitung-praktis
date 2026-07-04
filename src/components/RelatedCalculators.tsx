import { CalculatorMeta, getRelatedCalculators } from "../data/calculators";
import { CalculatorCard } from "./Cards";

export function RelatedCalculators({ calculator }: { calculator: CalculatorMeta }) {
  const related = getRelatedCalculators(calculator);
  return (
    <section className="content-section">
      <h2>Kalkulator Terkait</h2>
      <div className="card-grid compact-grid">
        {related.map((item) => (
          <CalculatorCard key={item.id} calculator={item} />
        ))}
      </div>
    </section>
  );
}
