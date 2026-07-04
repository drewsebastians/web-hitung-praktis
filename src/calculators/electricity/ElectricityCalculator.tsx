import { useMemo, useState } from "react";
import { CalculatorLayout } from "../../components/CalculatorLayout";
import { AppIcon } from "../../components/Icon";
import { Callout, ExampleBox, FormulaBox, InputField, ResultCard, SelectField } from "../../components/UI";
import { appliancePresets, electricityTariffConfig } from "../../data/electricityTariffs";
import type { CalculatorMeta } from "../../data/calculators";
import { formatKwh, formatNumber, formatRupiah, parseNumericInput } from "../../utils/format";
import { ApplianceInput, calculateElectricity, getTariffValue } from "./logic";

function makeAppliance(overrides: Partial<ApplianceInput> = {}): ApplianceInput {
  return {
    id: String(Date.now() + Math.random()),
    name: "Alat elektronik",
    watt: 100,
    units: 1,
    hoursPerDay: 4,
    daysPerMonth: 30,
    ...overrides
  };
}

export function ElectricityCalculator({ calculator }: { calculator: CalculatorMeta }) {
  const [tariffId, setTariffId] = useState("r1-1300");
  const [customTariff, setCustomTariff] = useState(1444.7);
  const [appliances, setAppliances] = useState<ApplianceInput[]>([makeAppliance({ name: "Kipas angin", watt: 45, hoursPerDay: 8 })]);
  const tariffPerKwh = getTariffValue(tariffId, customTariff);

  const validAppliances = appliances.filter(
    (item) => item.watt > 0 && item.units > 0 && item.hoursPerDay >= 0 && item.daysPerMonth > 0
  );
  const result = useMemo(() => calculateElectricity(validAppliances, tariffPerKwh > 0 ? tariffPerKwh : 0), [validAppliances, tariffPerKwh]);
  const hasInvalid = validAppliances.length !== appliances.length || tariffPerKwh <= 0;

  function updateAppliance(id: string, patch: Partial<ApplianceInput>) {
    setAppliances((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addPreset(label: string) {
    const preset = appliancePresets.find((item) => item.label === label);
    if (!preset) return;
    setAppliances((items) => [
      ...items,
      makeAppliance({ name: preset.label, watt: preset.watt, hoursPerDay: preset.hoursPerDay, units: 1, daysPerMonth: 30 })
    ]);
  }

  function reset() {
    setTariffId("r1-1300");
    setCustomTariff(1444.7);
    setAppliances([makeAppliance({ name: "Kipas angin", watt: 45, hoursPerDay: 8 })]);
  }

  const tool = (
    <section className="calculator-surface" aria-label="Form kalkulator biaya listrik">
      <div className="tool-toolbar">
        <SelectField
          id="tariff"
          label="Golongan tarif/daya listrik"
          value={tariffId}
          onChange={setTariffId}
          options={[
            ...electricityTariffConfig.tariffs.map((tariff) => ({ value: tariff.id, label: `${tariff.label} - Rp ${formatNumber(tariff.tariffPerKwh)}/kWh` })),
            { value: "custom", label: "Tarif custom" }
          ]}
          helper={`Data tarif default: ${electricityTariffConfig.lastUpdated}.`}
        />
        {tariffId === "custom" ? (
          <InputField
            id="custom-tariff"
            label="Tarif per kWh"
            value={customTariff}
            onChange={(value) => setCustomTariff(parseNumericInput(value))}
            min={0}
            step={0.01}
            suffix="Rp/kWh"
          />
        ) : null}
      </div>

      <div className="tool-actions">
        <SelectField
          id="preset"
          label="Tambah dari preset"
          value=""
          onChange={addPreset}
          options={[{ value: "", label: "Pilih alat elektronik" }, ...appliancePresets.map((preset) => ({ value: preset.label, label: preset.label }))]}
        />
        <button className="secondary-button" type="button" onClick={() => setAppliances((items) => [...items, makeAppliance()])}>
          <AppIcon name="plus" /> Tambah alat
        </button>
        <button className="ghost-button" type="button" onClick={reset}>
          <AppIcon name="reset" /> Reset
        </button>
      </div>

      {hasInvalid ? (
        <Callout title="Cek input" tone="warning" icon="alert">
          <p>Beberapa angka belum valid. Baris yang tidak masuk akal tidak ikut dihitung agar hasil tidak menampilkan NaN.</p>
        </Callout>
      ) : null}

      <div className="appliance-list">
        {appliances.map((item, index) => (
          <div className="appliance-row" key={item.id}>
            <InputField
              id={`name-${item.id}`}
              label={`Nama alat ${index + 1}`}
              type="text"
              value={item.name}
              onChange={(value) => updateAppliance(item.id, { name: value })}
            />
            <InputField
              id={`watt-${item.id}`}
              label="Daya alat"
              value={item.watt}
              onChange={(value) => updateAppliance(item.id, { watt: parseNumericInput(value) })}
              min={0}
              step={1}
              suffix="watt"
            />
            <InputField
              id={`units-${item.id}`}
              label="Jumlah unit"
              value={item.units}
              onChange={(value) => updateAppliance(item.id, { units: parseNumericInput(value) })}
              min={0}
              step={1}
              suffix="unit"
            />
            <InputField
              id={`hours-${item.id}`}
              label="Jam per hari"
              value={item.hoursPerDay}
              onChange={(value) => updateAppliance(item.id, { hoursPerDay: parseNumericInput(value) })}
              min={0}
              max={24}
              step={0.5}
              suffix="jam"
            />
            <InputField
              id={`days-${item.id}`}
              label="Hari per bulan"
              value={item.daysPerMonth}
              onChange={(value) => updateAppliance(item.id, { daysPerMonth: parseNumericInput(value) })}
              min={1}
              max={31}
              step={1}
              suffix="hari"
            />
            <button
              className="icon-button danger-button"
              type="button"
              aria-label={`Hapus ${item.name}`}
              onClick={() => setAppliances((items) => items.filter((entry) => entry.id !== item.id))}
              disabled={appliances.length === 1}
            >
              <AppIcon name="trash" />
            </button>
          </div>
        ))}
      </div>

      <div className="result-grid">
        <ResultCard label="kWh per hari" value={formatKwh(result.totalKwhPerDay)} />
        <ResultCard label="kWh per bulan" value={formatKwh(result.totalKwhPerMonth)} />
        <ResultCard label="Biaya per hari" value={formatRupiah(result.totalCostPerDay)} />
        <ResultCard label="Biaya per bulan" value={formatRupiah(result.totalCostPerMonth)} tone="strong" />
        <ResultCard label="Biaya per tahun" value={formatRupiah(result.totalCostPerYear)} />
      </div>

      <div className="table-wrap">
        <table>
          <caption>Rincian estimasi per alat</caption>
          <thead>
            <tr>
              <th>Alat</th>
              <th>kWh/bulan</th>
              <th>Biaya/bulan</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((item) => (
              <tr key={item.id}>
                <td>{item.name || "Alat elektronik"}</td>
                <td>{formatKwh(item.kwhPerMonth)}</td>
                <td>{formatRupiah(item.costPerMonth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <CalculatorLayout
      calculator={calculator}
      intro="Gunakan kalkulator ini untuk memperkirakan pemakaian kWh dan biaya listrik dari alat elektronik di rumah. Tambahkan beberapa alat agar total bulanannya lebih mudah terlihat."
      tool={tool}
      howTo={
        <ol>
          <li>Pilih golongan daya listrik atau masukkan tarif custom bila ingin memakai angka sendiri.</li>
          <li>Isi daya alat dalam watt, jumlah unit, jam pemakaian per hari, dan jumlah hari per bulan.</li>
          <li>Tambahkan alat lain seperti AC, kulkas, pompa air, TV, atau lampu LED bila diperlukan.</li>
          <li>Baca total kWh dan estimasi biaya pada bagian hasil.</li>
        </ol>
      }
      formula={
        <FormulaBox>
          <p>kWh per bulan = watt / 1000 x jumlah unit x jam per hari x hari per bulan</p>
          <p>Estimasi biaya = kWh per bulan x tarif per kWh</p>
        </FormulaBox>
      }
      example={
        <ExampleBox>
          <p>
            Kipas 45 watt dipakai 8 jam per hari selama 30 hari memakai tarif Rp 1.444,70/kWh. Pemakaian bulanannya sekitar
            10,8 kWh dan biayanya sekitar Rp 15.603 per bulan.
          </p>
        </ExampleBox>
      }
      notes={
        <>
          <p>
            Hasil adalah estimasi. Tagihan PLN asli bisa berbeda karena perubahan tarif, pajak, biaya admin, minimum
            pemakaian, efisiensi alat, mode hemat energi, dan kebiasaan pemakaian harian.
          </p>
          <p>{electricityTariffConfig.sourceNote}</p>
        </>
      }
      faq={[
        {
          question: "Apakah hasil ini sama dengan tagihan PLN?",
          answer: "Tidak selalu. Kalkulator hanya menghitung energi dari alat yang dimasukkan, belum memasukkan semua komponen tagihan dan variasi pemakaian nyata."
        },
        {
          question: "Apa bedanya watt dan kWh?",
          answer: "Watt adalah daya alat, sedangkan kWh adalah energi yang dipakai selama periode tertentu. Tagihan listrik dihitung dari kWh."
        },
        {
          question: "Kenapa kulkas dihitung 24 jam?",
          answer: "Kulkas menyala sepanjang hari, tetapi kompresornya tidak selalu aktif. Angka watt label tetap estimasi kasar, jadi hasil bisa lebih tinggi dari kondisi nyata."
        },
        {
          question: "Bagaimana jika tarif PLN berubah?",
          answer: "Pilih tarif custom dan masukkan tarif terbaru per kWh. Nilai default juga bisa diperbarui di file konfigurasi tarif."
        },
        {
          question: "Apakah bisa menghitung banyak alat?",
          answer: "Bisa. Tambahkan setiap alat agar tabel rincian dan total bulanan ikut diperbarui."
        }
      ]}
    />
  );
}
