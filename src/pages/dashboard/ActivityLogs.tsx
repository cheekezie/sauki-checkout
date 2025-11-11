import { useState, useEffect } from "react";
import { Search, User, Clock, Monitor, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { useActivity } from "@/hooks/useActivity";
import { ComponentLoading } from "@/components/ui/LoadingSpinner";
import type { Activity } from "@/interface/activity.interface";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

const ActivityLogs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useActivity({
    pageNumber: currentPage,
    search: debouncedSearch || undefined,
  });

  const activities = data?.data?.activity || [];
  const totalPages = data?.data?.pages || 1;
  const activityCount = data?.data?.activityCount || 0;
  const currentPageNum = data?.data?.page || 1;

  // Format timestamp
  const formatTimestamp = (activity: Activity) => {
    const timestamp = activity.createdAt || activity.timestamp;
    if (!timestamp) return "Invalid Date";
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      return date.toLocaleDateString("en-US", options);
    } catch {
      return "Invalid Date";
    }
  };

  // Get user display name
  const getUserName = (activity: Activity) => {
    // Try performedBy first (actual API structure)
    const performedBy = activity.performedBy;
    if (performedBy?.fullName) return performedBy.fullName;
    if (performedBy?.name) return performedBy.name;
    
    // Fallback to user (for backward compatibility)
    const user = activity.user;
    if (user?.fullName) return user.fullName;
    if (user?.name) return user.name;
    
    return "Unknown User";
  };

  // Get OS from deviceInfo or use os field
  const getOS = (activity: Activity) => {
    // Try deviceInfo first (actual API structure)
    if (activity.deviceInfo?.platform) return activity.deviceInfo.platform;
    if (activity.deviceInfo?.os) return activity.deviceInfo.os;
    
    // Fallback to direct os field
    if (activity.os) return activity.os;
    
    // Fallback to parsing userAgent
    if (activity.userAgent) {
      const ua = activity.userAgent.toLowerCase();
      if (ua.includes("windows")) return "Microsoft Windows";
      if (ua.includes("mac")) return "Apple Mac";
      if (ua.includes("linux")) return "Linux";
      if (ua.includes("android")) return "Android";
      if (ua.includes("ios")) return "iOS";
    }
    
    return "Unknown OS";
  };

  // Get browser from deviceInfo or use browser field
  const getBrowser = (activity: Activity) => {
    // Try deviceInfo first (actual API structure)
    if (activity.deviceInfo?.browser) return activity.deviceInfo.browser;
    
    // Fallback to direct browser field
    if (activity.browser) return activity.browser;
    
    // Fallback to parsing userAgent
    if (activity.userAgent) {
      const ua = activity.userAgent.toLowerCase();
      if (ua.includes("firefox")) return "Firefox";
      if (ua.includes("chrome") && !ua.includes("edg")) return "Chrome";
      if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
      if (ua.includes("edg")) return "Edge";
      if (ua.includes("opera")) return "Opera";
    }
    
    return "Unknown Browser";
  };

  // Determine stripe color based on index (pink for first 2, green for others)
  const getStripeColor = (index: number) => {
    return index < 2 ? "bg-pink-500" : "bg-green-500";
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <DashboardPageLayout
      title="Activity Logs"
      description="Monitor recent account activity and access history"
    >
      <>
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <ComponentLoading size="lg" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              Failed to load activity logs. Please try again.
            </div>
          )}

          {!isLoading && !error && (
            <>
              {activities.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 text-lg">No activity logs found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.map((activity, index) => (
                    <div
                      key={activity._id}
                      className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Colored Stripe - 10px wide */}
                      <div className={`absolute left-0 top-0 bottom-0 w-[15px] ${getStripeColor(index)}`} />
                      
                      {/* Card Content */}
                      <div className="pl-8 pr-4 py-4">
                        {/* Action Title */}
                        <h3 className="font-bold text-gray-900 text-base mb-2">
                          {activity.action || "Activity"}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {activity.description || "No description available"}
                        </p>
                        
                        {/* Details Row - All in one row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                          {/* User */}
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4 flex-shrink-0 text-primary" />
                            <span className="truncate">{getUserName(activity)}</span>
                          </div>
                          
                          {/* Timestamp */}
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 flex-shrink-0 text-primary" />
                            <span>{formatTimestamp(activity)}</span>
                          </div>
                          
                          {/* OS */}
                          <div className="flex items-center gap-1.5">
                            <Monitor className="w-4 h-4 flex-shrink-0 text-primary" />
                            <span>{getOS(activity)}</span>
                          </div>
                          
                          {/* Browser */}
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-4 h-4 flex-shrink-0 text-primary" />
                            <span>{getBrowser(activity)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {!isLoading && !error && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pt-6">
              <div className="text-sm text-gray-600">
                Page {currentPageNum} of {totalPages} • {activityCount} activities
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    </DashboardPageLayout>
  );
};

export default ActivityLogs;

