import { useState } from "react";
import { categories } from "../data/calculators";
import { AppIcon } from "./Icon";
import { InternalLink } from "./InternalLink";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <InternalLink to="/" className="brand" onNavigate={close}>
            <span className="brand-mark">HP</span>
            <span>
              <strong>HitungPraktis</strong>
              <small>Kalkulator harian Indonesia</small>
            </span>
          </InternalLink>
          <button className="icon-button menu-button" type="button" aria-label="Buka menu" onClick={() => setOpen((value) => !value)}>
            <AppIcon name={open ? "x" : "menu"} />
          </button>
          <nav className={`site-nav ${open ? "is-open" : ""}`} aria-label="Navigasi utama">
            {categories.map((category) => (
              <InternalLink key={category.id} to={category.path} onNavigate={close}>
                {category.shortTitle}
              </InternalLink>
            ))}
            <InternalLink to="/tentang/" onNavigate={close}>
              Tentang
            </InternalLink>
            <InternalLink to="/kontak/" onNavigate={close}>
              Kontak
            </InternalLink>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <strong>HitungPraktis</strong>
            <p>Kalkulator sederhana untuk rumah, belanja, dan usaha kecil. Semua hitungan berjalan di browser.</p>
          </div>
          <div className="footer-links">
            <InternalLink to="/privacy-policy/">Privacy Policy</InternalLink>
            <InternalLink to="/disclaimer/">Disclaimer</InternalLink>
            <InternalLink to="/kontak/">Kontak</InternalLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
