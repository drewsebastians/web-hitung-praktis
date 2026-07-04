import { useMemo, useState } from "react";
import { CalculatorLayout } from "../../components/CalculatorLayout";
import { Callout, ExampleBox, FormulaBox, InputField, ResultCard, SegmentedControl, SelectField } from "../../components/UI";
import type { CalculatorMeta } from "../../data/calculators";
import type { ShoeInputMode, SizeCategory } from "../../data/sizeTables";
import { formatNumber, parseNumericInput } from "../../utils/format";
import { convertShoeSize, recommendClothingSize } from "./logic";

const categoryOptions = [
  { value: "pria", label: "Pria" },
  { value: "wanita", label: "Wanita" },
  { value: "anak", label: "Anak" }
];

export function SizesCalculator({ calculator }: { calculator: CalculatorMeta }) {
  const [tab, setTab] = useState<"sepatu" | "baju">("sepatu");
  const [shoeCategory, setShoeCategory] = useState<SizeCategory>("pria");
  const [shoeMode, setShoeMode] = useState<ShoeInputMode>("cm");
  const [shoeValue, setShoeValue] = useState(26);
  const [clothingCategory, setClothingCategory] = useState<SizeCategory>("pria");
  const [chest, setChest] = useState(96);
  const [waist, setWaist] = useState(82);
  const [hip, setHip] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);

  const shoeResult = useMemo(() => convertShoeSize(shoeCategory, shoeMode, shoeValue), [shoeCategory, shoeMode, shoeValue]);
  const clothingResult = useMemo(
    () =>
      recommendClothingSize({
        category: clothingCategory,
        chest,
        waist,
        hip: hip > 0 ? hip : undefined,
        height: height > 0 ? height : undefined,
        weight: weight > 0 ? weight : undefined
      }),
    [chest, clothingCategory, height, hip, waist, weight]
  );

  function reset() {
    setTab("sepatu");
    setShoeCategory("pria");
    setShoeMode("cm");
    setShoeValue(26);
    setClothingCategory("pria");
    setChest(96);
    setWaist(82);
    setHip(0);
    setHeight(0);
    setWeight(0);
  }

  const tool = (
    <section className="calculator-surface" aria-label="Konverter ukuran sepatu dan baju">
      <div className="tool-toolbar between">
        <SegmentedControl
          label="Pilih jenis konversi"
          value={tab}
          options={[
            { value: "sepatu", label: "Sepatu" },
            { value: "baju", label: "Baju" }
          ]}
          onChange={setTab}
        />
        <button type="button" className="ghost-button" onClick={reset}>
          Reset
        </button>
      </div>

      {tab === "sepatu" ? (
        <>
          <div className="form-grid">
            <SelectField
              id="shoe-category"
              label="Kategori"
              value={shoeCategory}
              onChange={(value) => setShoeCategory(value as SizeCategory)}
              options={categoryOptions}
            />
            <SelectField
              id="shoe-mode"
              label="Input ukuran"
              value={shoeMode}
              onChange={(value) => setShoeMode(value as ShoeInputMode)}
              options={[
                { value: "cm", label: "Panjang kaki (cm)" },
                { value: "eu", label: "EU size" },
                { value: "us", label: "US size" },
                { value: "uk", label: "UK size" },
                { value: "jp", label: "JP/CM size" }
              ]}
            />
            <InputField
              id="shoe-value"
              label="Nilai ukuran"
              value={shoeValue}
              onChange={(value) => setShoeValue(parseNumericInput(value))}
              min={0}
              step={0.5}
              suffix={shoeMode === "cm" || shoeMode === "jp" ? "cm" : ""}
            />
          </div>
          {!shoeResult ? (
            <Callout title="Isi ukuran dulu" tone="warning" icon="alert">
              <p>Masukkan angka ukuran yang lebih besar dari nol.</p>
            </Callout>
          ) : (
            <>
              <div className="result-grid">
                <ResultCard label="EU" value={formatNumber(shoeResult.eu, 1)} tone="strong" />
                <ResultCard label="US" value={formatNumber(shoeResult.us, 1)} />
                <ResultCard label="UK" value={formatNumber(shoeResult.uk, 1)} />
                <ResultCard label="JP/CM" value={`${formatNumber(shoeResult.jp, 1)} cm`} />
                <ResultCard label="Saran rentang" value={shoeResult.suggestedRange} />
              </div>
              <Callout title="Catatan ukuran" tone="info">
                <p>{shoeResult.note}</p>
              </Callout>
            </>
          )}
        </>
      ) : (
        <>
          <div className="form-grid">
            <SelectField
              id="clothing-category"
              label="Kategori"
              value={clothingCategory}
              onChange={(value) => setClothingCategory(value as SizeCategory)}
              options={categoryOptions}
            />
            <InputField id="chest" label="Lingkar dada" value={chest} onChange={(value) => setChest(parseNumericInput(value))} min={0} step={0.5} suffix="cm" />
            <InputField id="waist" label="Lingkar pinggang" value={waist} onChange={(value) => setWaist(parseNumericInput(value))} min={0} step={0.5} suffix="cm" />
            <InputField id="hip" label="Lingkar pinggul" value={hip || ""} onChange={(value) => setHip(parseNumericInput(value))} min={0} step={0.5} suffix="cm" helper="Opsional" />
            <InputField id="height" label="Tinggi badan" value={height || ""} onChange={(value) => setHeight(parseNumericInput(value))} min={0} step={0.5} suffix="cm" helper="Opsional" />
            <InputField id="weight" label="Berat badan" value={weight || ""} onChange={(value) => setWeight(parseNumericInput(value))} min={0} step={0.5} suffix="kg" helper="Opsional" />
          </div>
          {!clothingResult ? (
            <Callout title="Isi ukuran utama" tone="warning" icon="alert">
              <p>Lingkar dada dan lingkar pinggang perlu diisi agar rekomendasi ukuran bisa dihitung.</p>
            </Callout>
          ) : (
            <>
              <div className="result-grid">
                <ResultCard label="Rekomendasi ukuran" value={clothingResult.size} tone="strong" />
                <ResultCard label="Rentang dada" value={`${clothingResult.matchedRow.chest[0]}-${clothingResult.matchedRow.chest[1]} cm`} />
                <ResultCard label="Rentang pinggang" value={`${clothingResult.matchedRow.waist[0]}-${clothingResult.matchedRow.waist[1]} cm`} />
              </div>
              <Callout title="Penjelasan" tone={clothingResult.warning ? "warning" : "info"} icon={clothingResult.warning ? "alert" : "info"}>
                <p>{clothingResult.explanation}</p>
                {clothingResult.warning ? <p>{clothingResult.warning}</p> : null}
              </Callout>
            </>
          )}
        </>
      )}
    </section>
  );

  return (
    <CalculatorLayout
      calculator={calculator}
      intro="Konverter ini membantu membandingkan ukuran sepatu dan memperkirakan ukuran baju umum sebelum belanja online. Gunakan sebagai panduan awal, lalu cocokkan dengan size chart brand."
      tool={tool}
      howTo={
        <ol>
          <li>Pilih tab Sepatu atau Baju.</li>
          <li>Untuk sepatu, pilih kategori dan jenis input seperti panjang kaki, EU, US, UK, atau JP/CM.</li>
          <li>Untuk baju, isi minimal lingkar dada dan lingkar pinggang dalam cm.</li>
          <li>Baca hasil rekomendasi dan catatan bila ukuran berada di antara dua pilihan.</li>
        </ol>
      }
      formula={
        <FormulaBox>
          <p>Sepatu: nilai input dicocokkan ke tabel konversi umum berdasarkan kategori.</p>
          <p>Baju: ukuran dipilih dari size terkecil yang masih memuat pengukuran utama pengguna.</p>
        </FormulaBox>
      }
      example={
        <ExampleBox>
          <p>
            Panjang kaki pria 26 cm umumnya mendekati EU 42, US 8, UK 7,5, dan JP 26 cm. Untuk baju pria dengan dada 96 cm dan pinggang 82 cm, rekomendasi umum berada di ukuran M.
          </p>
        </ExampleBox>
      }
      notes={
        <>
          <p>
            Ukuran sepatu dan baju berbeda antar brand, negara, model, bahan, dan potongan. Slim fit biasanya terasa lebih pas badan, regular fit lebih standar, sedangkan oversized memang dibuat lebih longgar.
          </p>
          <p>Selalu cek size chart resmi brand bila tersedia, terutama untuk produk impor atau pembelian yang tidak bisa ditukar.</p>
        </>
      }
      faq={[
        {
          question: "Bagaimana cara mengukur panjang kaki?",
          answer: "Letakkan kaki di atas kertas, tandai ujung tumit dan jari terpanjang, lalu ukur jaraknya dalam cm. Ukur sore hari saat kaki biasanya sedikit lebih mengembang."
        },
        {
          question: "Kenapa hasil bisa berada di antara dua ukuran?",
          answer: "Tabel ukuran sering memakai kelipatan 0,5 cm atau sistem negara yang tidak sejajar penuh. Jika berada di tengah, pertimbangkan lebar kaki dan jenis kaus kaki."
        },
        {
          question: "Apakah ukuran US pria dan wanita sama?",
          answer: "Tidak. Sistem US pria dan wanita berbeda, jadi pilih kategori yang sesuai sebelum mengonversi ukuran."
        },
        {
          question: "Apa ukuran baju yang paling penting?",
          answer: "Untuk atasan, lingkar dada biasanya paling penting. Untuk bawahan, pinggang dan pinggul lebih menentukan."
        },
        {
          question: "Apakah tinggi dan berat badan wajib diisi?",
          answer: "Tidak wajib. Keduanya hanya membantu terutama untuk kategori anak atau saat ukuran tubuh berada di batas dua size."
        }
      ]}
    />
  );
}
