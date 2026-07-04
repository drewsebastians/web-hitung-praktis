import { InternalLink } from "./InternalLink";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <InternalLink to="/">Beranda</InternalLink>
        </li>
        {items.map((item) => (
          <li key={item.label}>
            {item.path ? <InternalLink to={item.path}>{item.label}</InternalLink> : <span>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
