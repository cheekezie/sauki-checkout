import { LogOut, Settings, User, ChevronRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useDecodedAuth } from "@/hooks/useDecodedAuth";
import { useNavigate } from "react-router-dom";
import { MerchantRoles } from "@/enums/merchant.enum";
import { hasPermission } from "@/utils/permissions";

interface ProfileDropdownProps {
  onClose: () => void;
}

const ProfileDropdown = ({ onClose }: ProfileDropdownProps) => {
  const { logout } = useAuth();
  const { user, role, organizationName, permissions } = useDecodedAuth();
  const navigate = useNavigate();

  const canAccessSettings =
    role === MerchantRoles.PORTAL_ADMIN ||
    hasPermission(permissions, "stakeHolder.read");

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
    }
  };

  const handleProfileClick = () => {
    navigate("/dashboard/profile");
    onClose();
  };

  const handleSettingsClick = () => {
    navigate("/dashboard/settings");
    onClose();
  };

  return (
    <div className="py-2 min-w-[200px]">
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-slate-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full ring-2 ring-blue-500 overflow-hidden flex-shrink-0 bg-gray-200">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="user"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/avatar.png";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white text-sm font-semibold">
                {(user?.fullName || user?.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-medium text-slate-800 truncate text-left">
              {user?.fullName ||
                `${user?.firstName || "User"} ${user?.lastName || ""}`.trim() ||
                user?.name ||
                "User"}
            </p>
            <p className="text-xs text-slate-500 truncate text-left">
              {(role as string) || (user?.role as string) || "Role"}
              {organizationName ? ` • ${organizationName}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={handleProfileClick}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <User className="w-4 h-4 text-slate-500" />
            <span>View Profile</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {canAccessSettings && (
          <button
            onClick={handleSettingsClick}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        )}

        <div className="border-t border-slate-200/50 my-2"></div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
