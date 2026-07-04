import type { ReactNode } from "react";
import { AppIcon, type IconName } from "./Icon";

interface InputFieldProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  type?: "number" | "text";
  min?: number;
  max?: number;
  step?: number;
  helper?: string;
  suffix?: string;
  error?: string;
  placeholder?: string;
}

export function InputField({ id, label, value, onChange, type = "number", min, max, step, helper, suffix, error, placeholder }: InputFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input
          id={id}
          type={type}
          min={min}
          max={max}
          step={step}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={helper || error ? `${id}-hint` : undefined}
          aria-invalid={Boolean(error)}
        />
        {suffix ? <span className="input-suffix">{suffix}</span> : null}
      </div>
      {helper || error ? (
        <p className={error ? "field-error" : "field-helper"} id={`${id}-hint`}>
          {error ?? helper}
        </p>
      ) : null}
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  helper?: string;
}

export function SelectField({ id, label, value, onChange, options, helper }: SelectFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} aria-describedby={helper ? `${id}-hint` : undefined}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helper ? (
        <p className="field-helper" id={`${id}-hint`}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ label, value, options, onChange }: SegmentedControlProps<T>) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button key={option.value} type="button" className={option.value === value ? "is-active" : ""} onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

interface ResultCardProps {
  label: string;
  value: string;
  helper?: string;
  tone?: "default" | "strong" | "warning";
}

export function ResultCard({ label, value, helper, tone = "default" }: ResultCardProps) {
  return (
    <div className={`result-card result-card-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <small>{helper}</small> : null}
    </div>
  );
}

interface CalloutProps {
  title: string;
  children: ReactNode;
  icon?: IconName;
  tone?: "info" | "warning" | "success";
}

export function Callout({ title, children, icon = "info", tone = "info" }: CalloutProps) {
  return (
    <div className={`callout callout-${tone}`}>
      <div className="callout-icon">
        <AppIcon name={icon} size={18} />
      </div>
      <div>
        <strong>{title}</strong>
        <div>{children}</div>
      </div>
    </div>
  );
}

export function FormulaBox({ children }: { children: ReactNode }) {
  return <div className="formula-box">{children}</div>;
}

export function ExampleBox({ children }: { children: ReactNode }) {
  return <div className="example-box">{children}</div>;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection({ items }: { items: FAQItem[] }) {
  return (
    <section className="content-section">
      <h2>FAQ</h2>
      <div className="faq-list">
        {items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
