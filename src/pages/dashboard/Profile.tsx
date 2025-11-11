import { useDecodedAuth } from "@/hooks/useDecodedAuth";
import { formatDate, formatTimestamp } from "@/utils/dateFormatter";
import { CheckCircle2, XCircle, Shield, Mail, Phone, Calendar, Clock, Building2 } from "lucide-react";

const Profile = () => {
  const { user, role, organizationName } = useDecodedAuth();

  const formatGender = (gender?: string) => {
    if (!gender) return "—";
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary tracking-tight">
            Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">User account overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card - Full Width on Mobile, 1/3 on Desktop */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full ring-4 ring-primary/20 overflow-hidden bg-gray-200 flex-shrink-0 mb-4">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/avatar.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white text-3xl font-bold">
                    {(user?.fullName || user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.fullName || user?.name || "User"}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {(role as string) || user?.role || "Role"}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                {user?.phoneVerified !== undefined && (
                  <div className="flex items-center space-x-1">
                    {user.phoneVerified ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Phone Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-orange-600 font-medium">Phone Not Verified</span>
                      </>
                    )}
                  </div>
                )}
                {user?.disabled === true && (
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-600 font-medium">Account Disabled</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards - 2/3 on Desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full name</span>
                </div>
                <p className="text-base font-medium text-gray-900">
                  {user?.fullName || user?.name || "—"}
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</span>
                </div>
                <p className="text-base font-medium text-gray-900">
                  {formatGender(user?.gender)}
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</span>
                </div>
                <p className="text-base font-medium text-gray-900 break-all">
                  {user?.email || "—"}
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</span>
                  {user?.phoneVerified && (
                    <div title="Verified">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
                <p className="text-base font-medium text-gray-900">
                  {user?.phoneNumber || user?.phone || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Role</span>
                </div>
                <p className="text-base font-medium text-gray-900">
                  {(role as string) || user?.role || "—"}
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Organization</span>
                </div>
                <p className="text-base font-medium text-gray-900">
                  {organizationName || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Activity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {user?.lastLogin && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Login</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatTimestamp(user.lastLogin)}
                  </p>
                </div>
              )}
              {user?.createdAt && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Created</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(user.createdAt, 'long')}
                  </p>
                </div>
              )}
              {user?.updatedAt && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Updated</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(user.updatedAt, 'datetime')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
