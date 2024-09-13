import { LucideIcon } from "lucide-react";

export interface SidebarItems {
  links: Array<{
    label: string;
    path: string;
    icon?: LucideIcon;
  }>;
}
