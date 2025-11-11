import type { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface SidebarProps {
  collapsed: boolean;
  isMobileOpen: boolean;
  currentPage: string;
  onMobileMenuToggle: () => void;
  onCollapseToggle: () => void;
}

export interface HeaderProps {
  onSidebarCollapse: () => void;
  onMobileMenu: () => void;
  sideBarCollapsed: boolean;
  isMobileMenuOpen: boolean;
}

export interface MenuProps {
  collapsed: boolean;
}

type Placement = 'bottom' | 'top' | 'right' | 'left' | 'auto';

export interface DropdownProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
  placement?: Placement;
  children: ReactNode;
}

export interface SwitchBusinessProps {
  onClose: () => void;
}
