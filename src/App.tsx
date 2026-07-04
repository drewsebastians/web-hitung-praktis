import { useEffect, useState } from "react";
import { AcCalculator } from "./calculators/ac/AcCalculator";
import { ElectricityCalculator } from "./calculators/electricity/ElectricityCalculator";
import { PaintCalculator } from "./calculators/paint/PaintCalculator";
import { SizesCalculator } from "./calculators/sizes/SizesCalculator";
import { UmkmCalculator } from "./calculators/umkm/UmkmCalculator";
import { Layout } from "./components/Layout";
import { calculators, categories } from "./data/calculators";
import { CategoryPage } from "./pages/CategoryPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { StaticPage } from "./pages/StaticPage";
import { stripBase } from "./utils/routes";

const calculatorPages = {
  "biaya-listrik": ElectricityCalculator,
  "ukuran-sepatu-baju": SizesCalculator,
  "hpp-margin-markup": UmkmCalculator,
  "cat-tembok": PaintCalculator,
  "ac-pk": AcCalculator
};

export function App() {
  const [path, setPath] = useState(() => stripBase(window.location.pathname));

  useEffect(() => {
    const updatePath = () => setPath(stripBase(window.location.pathname));
    window.addEventListener("popstate", updatePath);
    return () => window.removeEventListener("popstate", updatePath);
  }, []);

  const calculator = calculators.find((item) => item.path === path);
  const category = categories.find((item) => item.path === path);

  let page = <NotFoundPage />;
  if (path === "/") page = <HomePage />;
  if (category) page = <CategoryPage category={category} />;
  if (calculator) {
    const Calculator = calculatorPages[calculator.id];
    page = <Calculator calculator={calculator} />;
  }
  if (["/tentang/", "/kontak/", "/privacy-policy/", "/disclaimer/"].includes(path)) {
    page = <StaticPage path={path} />;
  }

  return <Layout>{page}</Layout>;
}
