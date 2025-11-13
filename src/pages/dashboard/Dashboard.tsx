import { useMemo } from "react";
import DashboardBanner from "../../components/dashboard/DashboardBanner";
import StatsCard from "../../components/dashboard/StatsCard";
import RealTimeUpdate from "../../components/dashboard/RealTimeUpdate";
import { useDashboard } from "../../hooks/useDashboard";
import { ComponentLoading } from "../../components/ui/LoadingSpinner";
import { useDecodedAuth } from "../../hooks/useDecodedAuth";

const Dashboard = () => {
  const { isLoading: authLoading } = useDecodedAuth();

  // Get current date range (last 30 days) and traffic session
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const startDate = thirtyDaysAgo.toISOString().split("T")[0];
  const endDate = today.toISOString().split("T")[0];

  // Get traffic session from current year
  const currentYear = today.getFullYear();
  const previousYear = currentYear - 1;
  const trafficSession = `${previousYear}/${currentYear}`;

  const { data, isLoading } = useDashboard({
    start: startDate,
    end: endDate,
    trafficSession: trafficSession,
  });

  const dashboardData = useMemo(() => data?.data, [data]);

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ComponentLoading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Banner */}
      <DashboardBanner />

      {/* Stats Card - 3 Columns */}
      <StatsCard
        totalRevenue={dashboardData?.totalReceive}
        transactions={1550}
        avgPaymentValue={750}
      />

      {/* Real-Time Update Chart */}
      <RealTimeUpdate />
    </div>
  );
};

export default Dashboard;
