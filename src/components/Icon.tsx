import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Home,
  Info,
  Menu,
  Paintbrush,
  Plus,
  RotateCcw,
  Search,
  Shirt,
  ShoppingBag,
  Snowflake,
  Store,
  Trash2,
  X,
  Zap
} from "lucide-react";
import type { ComponentType } from "react";

export type IconName =
  | "alert"
  | "arrow-right"
  | "calculator"
  | "check"
  | "home"
  | "info"
  | "menu"
  | "paintbrush"
  | "plus"
  | "reset"
  | "search"
  | "shirt"
  | "shopping-bag"
  | "snowflake"
  | "store"
  | "trash"
  | "x"
  | "zap";

const icons: Record<IconName, ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>> = {
  alert: AlertTriangle,
  "arrow-right": ArrowRight,
  calculator: Calculator,
  check: CheckCircle2,
  home: Home,
  info: Info,
  menu: Menu,
  paintbrush: Paintbrush,
  plus: Plus,
  reset: RotateCcw,
  search: Search,
  shirt: Shirt,
  "shopping-bag": ShoppingBag,
  snowflake: Snowflake,
  store: Store,
  trash: Trash2,
  x: X,
  zap: Zap
};

interface AppIconProps {
  name: IconName;
  size?: number;
}

export function AppIcon({ name, size = 20 }: AppIconProps) {
  const Icon = icons[name];
  return <Icon aria-hidden size={size} strokeWidth={2} />;
}
