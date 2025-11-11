import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { ComponentLoading } from "../components/ui/LoadingSpinner";

export default function DashboardLayout() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const { state } = useAuth();

  return (
    <div className="min-h-screen bg-secondary/5 transition-all duration-500 font-sora relative">
      {/* Show loading overlay when auth is loading (e.g., during org switch) */}
      {state.isLoading && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <ComponentLoading size="lg" />
        </div>
      )}
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          collapsed={sideBarCollapsed}
          isMobileOpen={isMobileOpen}
          onSidebarCollapsed={() => setSideBarCollapsed(!sideBarCollapsed)}
          onCloseMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
          currentPage={currentPage}
          onPageChanged={setCurrentPage}
        />
        <div className="flex-1 flex flex-col overflow-hidden bg-secondary/5 backdrop-blur-sm">
          <Header
            sideBarCollapsed={sideBarCollapsed}
            onMobileMenu={() => setIsMobileOpen(true)}
            onSidebarCollapse={() => setSideBarCollapsed(!sideBarCollapsed)}
          />
          <main className="flex-1 overflow-y-auto bg-transparent">
            <div className="px-4 sm:p-6 space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
