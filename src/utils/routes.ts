export const basePath = import.meta.env.BASE_URL ?? "/";
export const siteUrl = "https://web-hitung-praktis.pages.dev";

export function normalizePath(path: string): string {
  const clean = path || "/";
  if (clean === "/") return "/";
  const withoutQuery = clean.split("?")[0].split("#")[0];
  return withoutQuery.endsWith("/") ? withoutQuery : `${withoutQuery}/`;
}

export function stripBase(pathname: string): string {
  const base = basePath === "/" ? "" : basePath.replace(/\/$/, "");
  if (base && pathname.startsWith(base)) {
    const stripped = pathname.slice(base.length) || "/";
    return normalizePath(stripped);
  }
  return normalizePath(pathname);
}

export function withBase(path: string): string {
  const normalized = normalizePath(path);
  if (basePath === "/") return normalized;
  return `${basePath.replace(/\/$/, "")}${normalized}`;
}

export function canonicalUrl(path: string): string {
  return `${siteUrl}${normalizePath(path)}`;
}

