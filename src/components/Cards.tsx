import type { CalculatorMeta, CategoryMeta } from "../data/calculators";
import { AppIcon } from "./Icon";
import { InternalLink } from "./InternalLink";

export function CalculatorCard({ calculator }: { calculator: CalculatorMeta }) {
  return (
    <InternalLink to={calculator.path} className="calculator-card">
      <span className="card-icon">
        <AppIcon name={calculator.iconName} />
      </span>
      <span>
        <strong>{calculator.shortTitle}</strong>
        <small>{calculator.description}</small>
      </span>
      <AppIcon name="arrow-right" size={18} />
    </InternalLink>
  );
}

export function CategoryCard({ category, count }: { category: CategoryMeta; count: number }) {
  return (
    <InternalLink to={category.path} className="category-card">
      <span className="card-icon">
        <AppIcon name={category.iconName} />
      </span>
      <span>
        <strong>{category.title}</strong>
        <small>{category.description}</small>
        <em>{count} kalkulator</em>
      </span>
    </InternalLink>
  );
}
