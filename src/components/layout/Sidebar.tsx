import NewSidebar from "./NewSidebar";

interface props {
  collapsed: boolean;
  isMobileOpen: boolean;
  currentPage: string;
  onCloseMobileMenu: () => void;
  onSidebarCollapsed: () => void;
  onPageChanged: (page: string) => void;
}

const Sidebar = (props: props) => {
  return <NewSidebar {...props} />;
};

export default Sidebar;
