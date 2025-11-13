import { Search, Bell } from "lucide-react";
import { useDecodedAuth } from "@/hooks/useDecodedAuth";

interface TopbarProps {
  title?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Topbar = ({
  title = "SaukiPay",
  activeTab = "overview",
  onTabChange,
}: TopbarProps) => {
  const { user } = useDecodedAuth();
  const tabs = ["Overview", "Graph Performance", "Revenue", "Schedule"];

  return (
    <header className="h-18  backdrop-blur-xl bg-bg/60 px-6 py-4 font-sora">
      <div className="flex items-center justify-between h-full">
        {/* Left Section - Title */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-text">{title}</h1>
        </div>

        {/* Center Section - Navigation Tabs */}
        <div className="flex-1 flex justify-center">
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const isActive =
                activeTab === tab.toLowerCase().replace(" ", "-");
              return (
                <button
                  key={tab}
                  onClick={() =>
                    onTabChange?.(tab.toLowerCase().replace(" ", "-"))
                  }
                  className={`px-4 py-2 rounded-2xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-primary text-primary bg-primary/5 border rounded-full"
                      : " text-dark hover:text-primary hover:border-primary/40"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section - Search, Notifications, Profile */}
        <div className="flex-1 flex items-center justify-end space-x-4">
          {/* Search Icon */}
          <button className="w-10 h-10 rounded-full bg-primary/5 border border-primary/5 text-dark hover:text-primary hover:border-primary/40 transition-all duration-200 flex items-center justify-center cursor-pointer">
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Bell */}
          <button className="relative w-10 h-10 rounded-full bg-primary/5 border border-primary/5 text-dark hover:text-primary hover:border-primary/40 transition-all duration-200 flex items-center justify-center cursor-pointer">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile Avatar */}
          <div className="w-10 h-10 rounded-full ring-2 ring-primary overflow-hidden bg-gray-200">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default avatar if image fails to load
                  (e.target as HTMLImageElement).src = "/avatar.png";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white text-xs font-semibold">
                {(user?.fullName || user?.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
