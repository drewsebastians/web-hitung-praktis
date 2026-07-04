import { useMemo, useState } from "react";
import { CalculatorLayout } from "../../components/CalculatorLayout";
import { Callout, ExampleBox, FormulaBox, InputField, ResultCard, SegmentedControl } from "../../components/UI";
import type { CalculatorMeta } from "../../data/calculators";
import { formatPercent, formatRupiah, parseNumericInput } from "../../utils/format";
import { calculateDiscountImpact, calculateHpp, calculateMargin, calculateTargetSellingPrice } from "./logic";

type UmkmMode = "hpp" | "target" | "margin" | "promo";

export function UmkmCalculator({ calculator }: { calculator: CalculatorMeta }) {
  const [mode, setMode] = useState<UmkmMode>("hpp");
  const [rawMaterials, setRawMaterials] = useState(250000);
  const [packaging, setPackaging] = useState(50000);
  const [labor, setLabor] = useState(75000);
  const [overhead, setOverhead] = useState(40000);
  const [otherCosts, setOtherCosts] = useState(0);
  const [unitsProduced, setUnitsProduced] = useState(50);
  const [hppPerUnit, setHppPerUnit] = useState(8300);
  const [sellingPrice, setSellingPrice] = useState(15000);
  const [adminFee, setAdminFee] = useState(750);
  const [discount, setDiscount] = useState(0);
  const [subsidizedShipping, setSubsidizedShipping] = useState(0);
  const [packingCost, setPackingCost] = useState(500);
  const [targetMargin, setTargetMargin] = useState(35);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [adminPercent, setAdminPercent] = useState(5);

  const hppResult = useMemo(
    () => calculateHpp({ rawMaterials, packaging, labor, overhead, otherCosts, unitsProduced }),
    [labor, overhead, otherCosts, packaging, rawMaterials, unitsProduced]
  );
  const marginResult = useMemo(
    () => calculateMargin({ hppPerUnit, sellingPrice, adminFee, discount, subsidizedShipping, packingCost }),
    [adminFee, discount, hppPerUnit, packingCost, sellingPrice, subsidizedShipping]
  );
  const targetPrice = useMemo(
    () => calculateTargetSellingPrice(hppPerUnit + packingCost + subsidizedShipping, targetMargin),
    [hppPerUnit, packingCost, subsidizedShipping, targetMargin]
  );
  const promoNetPrice = useMemo(() => calculateDiscountImpact(sellingPrice, discountPercent, adminPercent), [adminPercent, discountPercent, sellingPrice]);
  const promoMargin = useMemo(
    () =>
      calculateMargin({
        hppPerUnit,
        sellingPrice: promoNetPrice,
        adminFee: 0,
        discount: 0,
        subsidizedShipping,
        packingCost
      }),
    [hppPerUnit, packingCost, promoNetPrice, subsidizedShipping]
  );

  function reset() {
    setMode("hpp");
    setRawMaterials(250000);
    setPackaging(50000);
    setLabor(75000);
    setOverhead(40000);
    setOtherCosts(0);
    setUnitsProduced(50);
    setHppPerUnit(8300);
    setSellingPrice(15000);
    setAdminFee(750);
    setDiscount(0);
    setSubsidizedShipping(0);
    setPackingCost(500);
    setTargetMargin(35);
    setDiscountPercent(10);
    setAdminPercent(5);
  }

  const commonCostFields = (
    <>
      <InputField id="hpp-unit" label="HPP per unit" value={hppPerUnit} onChange={(value) => setHppPerUnit(parseNumericInput(value))} min={0} step={100} suffix="Rp" />
      <InputField id="packing-cost" label="Biaya packing" value={packingCost} onChange={(value) => setPackingCost(parseNumericInput(value))} min={0} step={100} suffix="Rp" helper="Opsional" />
      <InputField
        id="shipping-subsidy"
        label="Subsidi ongkir"
        value={subsidizedShipping}
        onChange={(value) => setSubsidizedShipping(parseNumericInput(value))}
        min={0}
        step={100}
        suffix="Rp"
        helper="Opsional"
      />
    </>
  );

  const tool = (
    <section className="calculator-surface" aria-label="Kalkulator HPP margin markup UMKM">
      <div className="tool-toolbar between">
        <SegmentedControl
          label="Mode kalkulator UMKM"
          value={mode}
          onChange={setMode}
          options={[
            { value: "hpp", label: "Hitung HPP" },
            { value: "target", label: "Target margin" },
            { value: "margin", label: "Margin harga jual" },
            { value: "promo", label: "Simulasi promo" }
          ]}
        />
        <button className="ghost-button" type="button" onClick={reset}>
          Reset
        </button>
      </div>

      {mode === "hpp" ? (
        <>
          <div className="form-grid">
            <InputField id="raw-materials" label="Biaya bahan baku" value={rawMaterials} onChange={(value) => setRawMaterials(parseNumericInput(value))} min={0} step={1000} suffix="Rp" />
            <InputField id="packaging" label="Biaya kemasan" value={packaging} onChange={(value) => setPackaging(parseNumericInput(value))} min={0} step={1000} suffix="Rp" />
            <InputField id="labor" label="Tenaga kerja langsung" value={labor} onChange={(value) => setLabor(parseNumericInput(value))} min={0} step={1000} suffix="Rp" helper="Opsional" />
            <InputField id="overhead" label="Overhead" value={overhead} onChange={(value) => setOverhead(parseNumericInput(value))} min={0} step={1000} suffix="Rp" helper="Opsional" />
            <InputField id="other-costs" label="Biaya lain-lain" value={otherCosts} onChange={(value) => setOtherCosts(parseNumericInput(value))} min={0} step={1000} suffix="Rp" helper="Opsional" />
            <InputField id="units-produced" label="Jumlah produk jadi" value={unitsProduced} onChange={(value) => setUnitsProduced(parseNumericInput(value))} min={1} step={1} suffix="unit" />
          </div>
          {unitsProduced <= 0 ? (
            <Callout title="Jumlah produk belum valid" tone="warning" icon="alert">
              <p>Jumlah produk harus lebih dari nol agar HPP per unit bisa dihitung.</p>
            </Callout>
          ) : null}
          <div className="result-grid">
            <ResultCard label="Total biaya produksi" value={formatRupiah(hppResult.totalCost)} />
            <ResultCard label="HPP per unit" value={formatRupiah(hppResult.hppPerUnit)} tone="strong" />
          </div>
        </>
      ) : null}

      {mode === "target" ? (
        <>
          <div className="form-grid">
            {commonCostFields}
            <InputField id="target-margin" label="Target margin" value={targetMargin} onChange={(value) => setTargetMargin(parseNumericInput(value))} min={0} max={99} step={0.5} suffix="%" />
          </div>
          <div className="result-grid">
            <ResultCard label="Total biaya per unit" value={formatRupiah(hppPerUnit + packingCost + subsidizedShipping)} />
            <ResultCard label="Harga jual minimum" value={formatRupiah(targetPrice)} tone="strong" helper={`Untuk target margin ${formatPercent(targetMargin)}`} />
          </div>
          {targetMargin >= 100 ? (
            <Callout title="Target margin terlalu tinggi" tone="warning" icon="alert">
              <p>Target margin harus di bawah 100% agar harga jual bisa dihitung.</p>
            </Callout>
          ) : null}
        </>
      ) : null}

      {mode === "margin" ? (
        <>
          <div className="form-grid">
            {commonCostFields}
            <InputField id="selling-price" label="Harga jual" value={sellingPrice} onChange={(value) => setSellingPrice(parseNumericInput(value))} min={0} step={100} suffix="Rp" />
            <InputField id="admin-fee" label="Biaya marketplace/admin" value={adminFee} onChange={(value) => setAdminFee(parseNumericInput(value))} min={0} step={100} suffix="Rp" helper="Opsional" />
            <InputField id="discount" label="Diskon nominal" value={discount} onChange={(value) => setDiscount(parseNumericInput(value))} min={0} step={100} suffix="Rp" helper="Opsional" />
          </div>
          <div className="result-grid">
            <ResultCard label="Harga jual bersih" value={formatRupiah(marginResult.netSellingPrice)} />
            <ResultCard label="Total biaya per unit" value={formatRupiah(marginResult.totalUnitCost)} />
            <ResultCard label="Laba kotor" value={formatRupiah(marginResult.grossProfit)} tone={marginResult.grossProfit < 0 ? "warning" : "strong"} />
            <ResultCard label="Margin" value={formatPercent(marginResult.marginPercent)} />
            <ResultCard label="Markup" value={formatPercent(marginResult.markupPercent)} />
          </div>
          {marginResult.warning ? (
            <Callout title="Perhatikan margin" tone="warning" icon="alert">
              <p>{marginResult.warning}</p>
            </Callout>
          ) : null}
        </>
      ) : null}

      {mode === "promo" ? (
        <>
          <div className="form-grid">
            {commonCostFields}
            <InputField id="promo-selling-price" label="Harga jual normal" value={sellingPrice} onChange={(value) => setSellingPrice(parseNumericInput(value))} min={0} step={100} suffix="Rp" />
            <InputField id="discount-percent" label="Diskon promo" value={discountPercent} onChange={(value) => setDiscountPercent(parseNumericInput(value))} min={0} max={100} step={0.5} suffix="%" />
            <InputField id="admin-percent" label="Admin/komisi marketplace" value={adminPercent} onChange={(value) => setAdminPercent(parseNumericInput(value))} min={0} max={100} step={0.5} suffix="%" />
          </div>
          <div className="result-grid">
            <ResultCard label="Harga setelah diskon & admin" value={formatRupiah(promoNetPrice)} />
            <ResultCard label="Laba setelah promo" value={formatRupiah(promoMargin.grossProfit)} tone={promoMargin.grossProfit < 0 ? "warning" : "strong"} />
            <ResultCard label="Margin setelah promo" value={formatPercent(promoMargin.marginPercent)} />
            <ResultCard label="Markup setelah promo" value={formatPercent(promoMargin.markupPercent)} />
          </div>
          {promoMargin.warning ? (
            <Callout title="Promo perlu dicek" tone="warning" icon="alert">
              <p>{promoMargin.warning}</p>
            </Callout>
          ) : null}
        </>
      ) : null}
    </section>
  );

  return (
    <CalculatorLayout
      calculator={calculator}
      intro="Alat bantu untuk menghitung HPP, harga jual, laba kotor, margin, markup, dan dampak diskon agar keputusan harga UMKM lebih jelas."
      tool={tool}
      howTo={
        <ol>
          <li>Pilih mode sesuai kebutuhan: HPP, target margin, margin dari harga jual, atau simulasi promo.</li>
          <li>Isi biaya yang relevan. Biaya opsional boleh diisi nol bila belum ada.</li>
          <li>Bandingkan margin dan markup untuk melihat apakah harga masih sehat.</li>
          <li>Gunakan mode promo sebelum mengikuti diskon marketplace agar laba tidak hilang tanpa terasa.</li>
        </ol>
      }
      formula={
        <FormulaBox>
          <p>HPP per unit = total biaya produksi / jumlah produk jadi</p>
          <p>Laba kotor = harga jual bersih - total biaya per unit</p>
          <p>Margin = laba kotor / harga jual bersih x 100</p>
          <p>Markup = laba kotor / HPP x 100</p>
          <p>Harga jual target margin = total biaya per unit / (1 - target margin)</p>
        </FormulaBox>
      }
      example={
        <ExampleBox>
          <p>
            Total biaya produksi Rp 415.000 menghasilkan 50 produk, maka HPP sekitar Rp 8.300 per unit. Jika dijual Rp 15.000 dengan biaya admin Rp 750 dan packing Rp 500, laba kotor sekitar Rp 5.450 per unit.
          </p>
        </ExampleBox>
      }
      notes={
        <p>
          Kalkulator ini adalah alat estimasi bisnis, bukan nasihat akuntansi, pajak, atau hukum. Pastikan tetap menghitung biaya tersembunyi seperti retur, produk rusak, biaya foto, iklan, penyimpanan, dan pajak bila berlaku.
        </p>
      }
      faq={[
        {
          question: "Apa bedanya margin dan markup?",
          answer: "Margin membandingkan laba dengan harga jual bersih, sedangkan markup membandingkan laba dengan HPP. Angkanya bisa berbeda walau laba rupiahnya sama."
        },
        {
          question: "Apakah biaya tenaga kerja perlu dimasukkan?",
          answer: "Sebaiknya iya, terutama jika waktu produksi cukup besar. Tanpa tenaga kerja, harga jual bisa terlihat untung padahal waktu kerja belum dibayar."
        },
        {
          question: "Biaya marketplace dihitung sebagai nominal atau persen?",
          answer: "Mode margin memakai nominal agar mudah memasukkan biaya aktual. Mode promo memakai persen untuk simulasi diskon dan komisi marketplace."
        },
        {
          question: "Berapa margin yang sehat untuk UMKM?",
          answer: "Tidak ada angka tunggal. Produk makanan, fashion, jasa, dan reseller punya struktur biaya berbeda. Gunakan hasil untuk membandingkan skenario."
        },
        {
          question: "Apakah HPP sama dengan modal?",
          answer: "HPP adalah biaya langsung per produk. Modal usaha bisa lebih luas karena mencakup alat, stok, kas, sewa, dan biaya operasional lain."
        }
      ]}
    />
  );
}
