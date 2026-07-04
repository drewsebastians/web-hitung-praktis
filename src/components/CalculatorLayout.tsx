import type { ReactNode } from "react";
import { CalculatorMeta, getCategory } from "../data/calculators";
import { usePageMeta } from "../utils/seo";
import { Breadcrumbs } from "./Breadcrumbs";
import { RelatedCalculators } from "./RelatedCalculators";
import { FAQItem, FAQSection } from "./UI";

interface CalculatorLayoutProps {
  calculator: CalculatorMeta;
  intro: string;
  tool: ReactNode;
  howTo: ReactNode;
  formula: ReactNode;
  example: ReactNode;
  notes: ReactNode;
  faq: FAQItem[];
}

export function CalculatorLayout({ calculator, intro, tool, howTo, formula, example, notes, faq }: CalculatorLayoutProps) {
  const category = getCategory(calculator.category);
  usePageMeta(calculator.metaTitle, calculator.metaDescription, calculator.path);

  return (
    <article className="calculator-page">
      <div className="container page-header">
        <Breadcrumbs
          items={[
            { label: category.shortTitle, path: category.path },
            { label: calculator.title }
          ]}
        />
        <div className="eyebrow">{category.shortTitle}</div>
        <h1>{calculator.title}</h1>
        <p>{intro}</p>
      </div>
      <div className="container">{tool}</div>
      <div className="container content-stack">
        <section className="content-section">
          <h2>Cara Menggunakan</h2>
          {howTo}
        </section>
        <section className="content-section">
          <h2>Rumus</h2>
          {formula}
        </section>
        <section className="content-section">
          <h2>Contoh Perhitungan</h2>
          {example}
        </section>
        <section className="content-section">
          <h2>Catatan Penting</h2>
          {notes}
        </section>
        <FAQSection items={faq} />
        <RelatedCalculators calculator={calculator} />
      </div>
    </article>
  );
}
