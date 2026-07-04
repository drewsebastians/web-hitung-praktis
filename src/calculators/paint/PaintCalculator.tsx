import { useMemo, useState } from "react";
import { CalculatorLayout } from "../../components/CalculatorLayout";
import { Callout, ExampleBox, FormulaBox, InputField, ResultCard, SegmentedControl, SelectField } from "../../components/UI";
import type { CalculatorMeta } from "../../data/calculators";
import { paintConfig } from "../../data/paintConfig";
import { formatNumber, formatRupiah, parseNumericInput } from "../../utils/format";
import { calculatePaint, defaultPaintInput, type PaintInput } from "./logic";

export function PaintCalculator({ calculator }: { calculator: CalculatorMeta }) {
  const [input, setInput] = useState<PaintInput>(defaultPaintInput);
  const result = useMemo(() => calculatePaint(input), [input]);

  function update<K extends keyof PaintInput>(key: K, value: PaintInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  const tool = (
    <section className="calculator-surface" aria-label="Kalkulator kebutuhan cat tembok">
      <div className="tool-toolbar between">
        <SegmentedControl
          label="Mode hitung cat"
          value={input.mode}
          options={[
            { value: "room", label: "Ukuran ruangan" },
            { value: "area", label: "Luas langsung" }
          ]}
          onChange={(value) => update("mode", value)}
        />
        <button className="ghost-button" type="button" onClick={() => setInput(defaultPaintInput)}>
          Reset
        </button>
      </div>

      <div className="form-grid">
        {input.mode === "room" ? (
          <>
            <InputField id="room-length" label="Panjang ruangan" value={input.length} onChange={(value) => update("length", parseNumericInput(value))} min={0} step={0.1} suffix="m" />
            <InputField id="room-width" label="Lebar ruangan" value={input.width} onChange={(value) => update("width", parseNumericInput(value))} min={0} step={0.1} suffix="m" />
            <InputField id="room-height" label="Tinggi dinding" value={input.height} onChange={(value) => update("height", parseNumericInput(value))} min={0} step={0.1} suffix="m" />
          </>
        ) : (
          <InputField
            id="direct-wall-area"
            label="Luas dinding langsung"
            value={input.directWallArea}
            onChange={(value) => update("directWallArea", parseNumericInput(value))}
            min={0}
            step={0.1}
            suffix="m2"
          />
        )}
        <InputField id="doors" label="Jumlah pintu" value={input.doors} onChange={(value) => update("doors", parseNumericInput(value))} min={0} step={1} suffix="pintu" />
        <InputField id="windows" label="Jumlah jendela" value={input.windows} onChange={(value) => update("windows", parseNumericInput(value))} min={0} step={1} suffix="jendela" />
        <InputField id="door-area" label="Luas per pintu" value={input.doorArea} onChange={(value) => update("doorArea", parseNumericInput(value))} min={0} step={0.1} suffix="m2" />
        <InputField id="window-area" label="Luas per jendela" value={input.windowArea} onChange={(value) => update("windowArea", parseNumericInput(value))} min={0} step={0.1} suffix="m2" />
        <InputField id="coats" label="Jumlah lapisan" value={input.coats} onChange={(value) => update("coats", parseNumericInput(value))} min={1} step={1} suffix="lapis" />
        <InputField id="coverage" label="Daya sebar cat" value={input.coverage} onChange={(value) => update("coverage", parseNumericInput(value))} min={1} step={0.5} suffix="m2/liter" />
        <InputField id="waste" label="Cadangan/waste" value={input.wastePercent} onChange={(value) => update("wastePercent", parseNumericInput(value))} min={0} step={1} suffix="%" />
        <SelectField
          id="can-size"
          label="Ukuran kaleng"
          value={String(input.canSize)}
          onChange={(value) => update("canSize", parseNumericInput(value))}
          options={paintConfig.canSizesLiter.map((size) => ({ value: String(size), label: `${formatNumber(size, 1)} liter` }))}
        />
        <InputField id="price-per-can" label="Harga per kaleng" value={input.pricePerCan || ""} onChange={(value) => update("pricePerCan", parseNumericInput(value))} min={0} step={1000} suffix="Rp" helper="Opsional" />
      </div>

      {result.netWallArea <= 0 || input.coverage <= 0 ? (
        <Callout title="Cek ukuran ruangan" tone="warning" icon="alert">
          <p>Luas dinding bersih atau daya sebar belum valid. Hasil akan nol sampai input diperbaiki.</p>
        </Callout>
      ) : null}

      <div className="result-grid">
        <ResultCard label="Luas dinding kotor" value={`${formatNumber(result.grossWallArea)} m2`} />
        <ResultCard label="Luas pintu/jendela" value={`${formatNumber(result.openingArea)} m2`} />
        <ResultCard label="Luas dinding bersih" value={`${formatNumber(result.netWallArea)} m2`} />
        <ResultCard label="Liter cat dibutuhkan" value={`${formatNumber(result.finalLiters)} liter`} tone="strong" />
        <ResultCard label="Rekomendasi kaleng" value={`${result.recommendedCans} kaleng`} helper={`Total ${formatNumber(result.totalCanLiters, 1)} liter`} />
        {result.estimatedCost !== undefined ? <ResultCard label="Estimasi biaya" value={formatRupiah(result.estimatedCost)} /> : null}
      </div>
    </section>
  );

  return (
    <CalculatorLayout
      calculator={calculator}
      intro="Hitung perkiraan liter cat tembok dan jumlah kaleng berdasarkan ukuran ruangan, luas pintu/jendela, jumlah lapisan, dan daya sebar cat."
      tool={tool}
      howTo={
        <ol>
          <li>Pilih mode ukuran ruangan atau luas dinding langsung.</li>
          <li>Isi ukuran dinding, jumlah pintu, jumlah jendela, dan asumsi luas bukaannya.</li>
          <li>Masukkan jumlah lapisan cat, daya sebar per liter, dan cadangan waste.</li>
          <li>Pilih ukuran kaleng untuk melihat rekomendasi jumlah pembelian.</li>
        </ol>
      }
      formula={
        <FormulaBox>
          <p>Luas dinding = 2 x (panjang + lebar) x tinggi</p>
          <p>Luas bersih = luas dinding - luas pintu - luas jendela</p>
          <p>Kebutuhan liter = luas bersih x jumlah lapisan / daya sebar</p>
          <p>Kebutuhan final = kebutuhan liter x (1 + cadangan waste)</p>
        </FormulaBox>
      }
      example={
        <ExampleBox>
          <p>
            Kamar 3 x 4 m dengan tinggi 3 m memiliki luas dinding kotor 42 m2. Setelah dikurangi 1 pintu dan 1 jendela, lalu dicat 2 lapis dengan daya sebar 11 m2/liter dan cadangan 10%, kebutuhan cat sekitar 7 liter.
          </p>
        </ExampleBox>
      }
      notes={
        <p>
          Hasil adalah estimasi. Pemakaian cat nyata dipengaruhi kondisi tembok, warna lama dan baru, jenis cat, primer, roller atau kuas, tekstur permukaan, dan kemampuan aplikasi. Tambahkan cadangan bila tembok kasar atau perubahan warna sangat kontras.
        </p>
      }
      faq={[
        {
          question: "Kenapa perlu menambahkan cadangan waste?",
          answer: "Cadangan membantu menutup kehilangan saat aplikasi, permukaan menyerap lebih banyak, dan kebutuhan touch up setelah cat kering."
        },
        {
          question: "Berapa daya sebar cat yang umum?",
          answer: "Banyak cat tembok berada di kisaran 10-12 m2 per liter per lapisan, tetapi selalu cek label produk karena setiap cat bisa berbeda."
        },
        {
          question: "Apakah plafon ikut dihitung?",
          answer: "Tidak. Kalkulator ini fokus pada dinding. Jika ingin mengecat plafon, tambahkan luas plafon lewat mode luas dinding langsung."
        },
        {
          question: "Apakah pintu dan jendela harus dikurangi?",
          answer: "Sebaiknya dikurangi agar estimasi tidak terlalu tinggi. Jika ragu, gunakan asumsi luas default atau isi luas custom."
        },
        {
          question: "Kapan perlu primer?",
          answer: "Primer sering berguna untuk tembok baru, permukaan belang, atau perubahan warna ekstrem. Kebutuhan primer sebaiknya dihitung terpisah sesuai produk."
        }
      ]}
    />
  );
}
