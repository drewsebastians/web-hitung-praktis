import { useMemo, useState } from "react";
import { CalculatorLayout } from "../../components/CalculatorLayout";
import { Callout, ExampleBox, FormulaBox, InputField, ResultCard, SelectField } from "../../components/UI";
import type { CalculatorMeta } from "../../data/calculators";
import { acConfig } from "../../data/acConfig";
import { formatNumber, parseNumericInput } from "../../utils/format";
import { calculateAc, type AcInput, type HeatDeviceLevel, type RoomType, type SunlightLevel } from "./logic";

export function AcCalculator({ calculator }: { calculator: CalculatorMeta }) {
  const [input, setInput] = useState<AcInput>({
    length: 3,
    width: 4,
    height: 2.8,
    people: 2,
    sunlight: "normal",
    roomType: "kamar tidur",
    topFloor: false,
    heatDevices: "rendah"
  });
  const result = useMemo(() => calculateAc(input), [input]);

  function update<K extends keyof AcInput>(key: K, value: AcInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  const tool = (
    <section className="calculator-surface" aria-label="Kalkulator kebutuhan AC PK ruangan">
      <div className="tool-toolbar between">
        <p className="tool-note">Dasar hitung: sekitar {acConfig.baseBtuPerM2} BTU per m2, lalu disesuaikan kondisi ruangan.</p>
        <button
          className="ghost-button"
          type="button"
          onClick={() =>
            setInput({
              length: 3,
              width: 4,
              height: 2.8,
              people: 2,
              sunlight: "normal",
              roomType: "kamar tidur",
              topFloor: false,
              heatDevices: "rendah"
            })
          }
        >
          Reset
        </button>
      </div>

      <div className="form-grid">
        <InputField id="ac-length" label="Panjang ruangan" value={input.length} onChange={(value) => update("length", parseNumericInput(value))} min={0} step={0.1} suffix="m" />
        <InputField id="ac-width" label="Lebar ruangan" value={input.width} onChange={(value) => update("width", parseNumericInput(value))} min={0} step={0.1} suffix="m" />
        <InputField id="ac-height" label="Tinggi ruangan" value={input.height} onChange={(value) => update("height", parseNumericInput(value))} min={0} step={0.1} suffix="m" helper="Opsional, isi tinggi rata-rata" />
        <InputField id="ac-people" label="Jumlah orang biasanya" value={input.people} onChange={(value) => update("people", parseNumericInput(value))} min={0} step={1} suffix="orang" />
        <SelectField
          id="sunlight"
          label="Kondisi sinar matahari"
          value={input.sunlight}
          onChange={(value) => update("sunlight", value as SunlightLevel)}
          options={[
            { value: "rendah", label: "Rendah" },
            { value: "normal", label: "Normal" },
            { value: "tinggi", label: "Tinggi" }
          ]}
        />
        <SelectField
          id="room-type"
          label="Jenis ruangan"
          value={input.roomType}
          onChange={(value) => update("roomType", value as RoomType)}
          options={[
            { value: "kamar tidur", label: "Kamar tidur" },
            { value: "ruang keluarga", label: "Ruang keluarga" },
            { value: "kantor kecil", label: "Kantor kecil" },
            { value: "dapur ringan", label: "Dapur ringan" }
          ]}
        />
        <SelectField
          id="top-floor"
          label="Lantai atas/atap langsung"
          value={input.topFloor ? "ya" : "tidak"}
          onChange={(value) => update("topFloor", value === "ya")}
          options={[
            { value: "tidak", label: "Tidak" },
            { value: "ya", label: "Ya" }
          ]}
        />
        <SelectField
          id="heat-devices"
          label="Banyak perangkat panas"
          value={input.heatDevices}
          onChange={(value) => update("heatDevices", value as HeatDeviceLevel)}
          options={[
            { value: "rendah", label: "Rendah" },
            { value: "sedang", label: "Sedang" },
            { value: "tinggi", label: "Tinggi" }
          ]}
          helper="Contoh: komputer, kulkas kecil, lampu panas, alat masak ringan."
        />
      </div>

      {input.length <= 0 || input.width <= 0 ? (
        <Callout title="Ukuran ruangan belum valid" tone="warning" icon="alert">
          <p>Panjang dan lebar ruangan perlu lebih dari nol agar rekomendasi AC bisa dihitung.</p>
        </Callout>
      ) : null}

      <div className="result-grid">
        <ResultCard label="Luas ruangan" value={`${formatNumber(result.area)} m2`} />
        <ResultCard label="Estimasi kebutuhan" value={`${formatNumber(result.estimatedBtu, 0)} BTU/jam`} />
        <ResultCard label="Rekomendasi AC" value={result.recommendedPk} tone="strong" helper={`Sekitar ${formatNumber(result.recommendedBtu, 0)} BTU/jam`} />
        {result.lowerAlternative ? <ResultCard label="Alternatif lebih kecil" value={result.lowerAlternative} helper="Bisa dipertimbangkan bila ruangan teduh dan tertutup baik." /> : null}
        {result.higherAlternative ? <ResultCard label="Alternatif lebih besar" value={result.higherAlternative} helper="Bisa dipertimbangkan bila ruangan sering panas." /> : null}
      </div>

      <Callout title="Kenapa hasil berubah?" tone="info">
        <ul className="plain-list">
          {result.explanation.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Callout>
    </section>
  );

  return (
    <CalculatorLayout
      calculator={calculator}
      intro="Perkirakan kebutuhan BTU dan rekomendasi PK AC berdasarkan ukuran ruangan, jumlah orang, paparan matahari, lantai atas, dan perangkat yang menghasilkan panas."
      tool={tool}
      howTo={
        <ol>
          <li>Masukkan panjang dan lebar ruangan untuk mendapatkan luas lantai.</li>
          <li>Isi tinggi ruangan, jumlah orang, dan kondisi panas ruangan.</li>
          <li>Pilih jenis ruangan dan apakah ruangan berada langsung di bawah atap.</li>
          <li>Baca estimasi BTU dan rekomendasi PK AC yang paling dekat.</li>
        </ol>
      }
      formula={
        <FormulaBox>
          <p>BTU dasar = luas ruangan x sekitar 500-600 BTU per m2</p>
          <p>BTU akhir = BTU dasar x faktor matahari x faktor jenis ruangan x faktor perangkat panas x faktor tinggi/atap + tambahan orang</p>
        </FormulaBox>
      }
      example={
        <ExampleBox>
          <p>
            Kamar 3 x 4 m memiliki luas 12 m2. Dengan kondisi normal dan 2 orang, kebutuhan awal sekitar 6.600 BTU. Rekomendasi praktis biasanya mendekati AC 3/4 PK atau 1 PK tergantung panas ruangan dan kualitas insulasi.
          </p>
        </ExampleBox>
      }
      notes={
        <p>
          Ini adalah estimasi praktis. Pilihan akhir dapat dipengaruhi insulasi, tinggi plafon, arah matahari, kebocoran udara, jumlah kaca, efisiensi brand, inverter/non-inverter, dan rekomendasi teknisi pemasangan.
        </p>
      }
      faq={[
        {
          question: "Apa itu BTU dan PK AC?",
          answer: "BTU menunjukkan kapasitas pendinginan per jam, sedangkan PK adalah istilah umum kapasitas AC di pasar Indonesia. Tabel PK biasanya memetakan 1/2 PK sekitar 5.000 BTU sampai 2,5 PK sekitar 24.000 BTU."
        },
        {
          question: "Kenapa ruangan panas butuh PK lebih besar?",
          answer: "Sinar matahari, atap langsung, orang, dan perangkat panas menambah beban pendinginan sehingga AC perlu kapasitas lebih tinggi."
        },
        {
          question: "Apa risiko AC terlalu kecil?",
          answer: "AC bisa bekerja terus-menerus, ruangan lama dingin, konsumsi listrik naik, dan usia kompresor lebih berat."
        },
        {
          question: "Apa risiko AC terlalu besar?",
          answer: "AC bisa terlalu cepat mencapai suhu target tanpa mengurangi lembap dengan baik, terasa kurang nyaman, dan biaya pembelian lebih tinggi."
        },
        {
          question: "Apakah hasil ini sudah menghitung biaya listrik?",
          answer: "Belum. Setelah memilih AC, gunakan kalkulator biaya listrik PLN untuk memperkirakan biaya pemakaian per bulan."
        }
      ]}
    />
  );
}
