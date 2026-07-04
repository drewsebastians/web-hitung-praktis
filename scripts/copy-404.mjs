import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

if (existsSync("dist/index.html")) {
  copyFileSync("dist/index.html", "dist/404.html");

  const routes = [
    "/rumah/",
    "/belanja-ukuran/",
    "/umkm/",
    "/rumah/kalkulator-biaya-listrik/",
    "/belanja-ukuran/konverter-ukuran-sepatu-baju/",
    "/umkm/kalkulator-hpp-margin-markup/",
    "/rumah/kalkulator-kebutuhan-cat-tembok/",
    "/rumah/kalkulator-kebutuhan-ac-pk/",
    "/tentang/",
    "/kontak/",
    "/privacy-policy/",
    "/disclaimer/"
  ];

  for (const route of routes) {
    const outputFile = join("dist", route, "index.html");
    mkdirSync(dirname(outputFile), { recursive: true });
    copyFileSync("dist/index.html", outputFile);
  }
}
