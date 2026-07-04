import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { withBase } from "../utils/routes";

interface InternalLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  children: ReactNode;
  onNavigate?: (path: string) => void;
}

export function InternalLink({ to, children, onNavigate, onClick, ...props }: InternalLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    window.history.pushState({}, "", withBase(to));
    window.dispatchEvent(new PopStateEvent("popstate"));
    onNavigate?.(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <a href={withBase(to)} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
