import { Building, ArrowUpRight, TrendingUp } from "lucide-react";
import type { ChartData } from "../../services/dashboard.service";
import { formatCurrency } from "../../utils/formatCurrency";

interface RevenueCardProps {
  region: string;
  value: string;
  change: string;
  updateTime: string;
  bgColor: string;
  textColor: string;
}

const RevenueCard = ({
  region,
  value,
  change,
  updateTime,
  bgColor,
  textColor,
}: RevenueCardProps) => {
  // Determine change badge styling based on background color
  const getChangeBadgeStyle = () => {
    if (bgColor === "bg-primary" || bgColor === "bg-secondary") {
      return "bg-white/20 text-white";
    }
    return "bg-dark/20 text-dark";
  };

  // Determine arrow icon styling based on background color
  const getArrowStyle = () => {
    if (bgColor === "bg-primary" || bgColor === "bg-secondary") {
      return "bg-white/20 text-white";
    }
    return "bg-dark/20 text-dark";
  };

  return (
    <div
      className={`${bgColor} ${textColor} rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base font-medium mb-2">{region}</h3>
          <p className="text-xl md:text-2xl font-bold mb-2">{value}</p>

          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getChangeBadgeStyle()}`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>{change}</span>
            </span>
          </div>

          <p className="text-xs md:text-sm opacity-80">{updateTime}</p>
        </div>

        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${getArrowStyle()}`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

interface RevenueSectionProps {
  chartData?: ChartData;
}

const RevenueSection = ({ chartData }: RevenueSectionProps) => {
  // Calculate total revenue from chart data
  const totalSchoolFees = chartData?.schoolFess?.reduce((sum, val) => sum + val, 0) ?? 0;
  const totalOtherFees = chartData?.otherFees?.reduce((sum, val) => sum + val, 0) ?? 0;
  
  const revenueData = [
    {
      region: "School Fees Revenue",
      value: formatCurrency(totalSchoolFees),
      change: "0%",
      updateTime: "Current period",
      bgColor: "bg-primary",
      textColor: "text-white",
    },
    {
      region: "Other Fees Revenue",
      value: formatCurrency(totalOtherFees),
      change: "0%",
      updateTime: "Current period",
      bgColor: "bg-secondary",
      textColor: "text-white",
    },
    {
      region: "Total Revenue",
      value: formatCurrency(totalSchoolFees + totalOtherFees),
      change: "0%",
      updateTime: "Current period",
      bgColor: "bg-slate-100",
      textColor: "text-slate-800",
    },
    {
      region: "Average Daily Revenue",
      value: chartData?.labels?.length 
        ? formatCurrency((totalSchoolFees + totalOtherFees) / chartData.labels.length)
        : formatCurrency(0),
      change: "0%",
      updateTime: "Current period",
      bgColor: "bg-slate-100",
      textColor: "text-slate-800",
    },
  ];

  return (
    <div className="bg-bg/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm font-sora">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 min-w-0">
          <Building className="w-5 h-5 text-dark" />
          <h2 className="text-lg md:text-xl font-semibold text-text">
            Revenue Information
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="w-10 h-10 rounded-full bg-primary/10 text-dark hover:text-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-primary/10 text-dark hover:text-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center">
            <div className="w-5 h-5 flex flex-col items-center justify-center space-y-1">
              <div className="w-1 h-1 bg-dark rounded-full"></div>
              <div className="w-1 h-1 bg-dark rounded-full"></div>
              <div className="w-1 h-1 bg-dark rounded-full"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Revenue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
        {revenueData.map((revenue, index) => (
          <RevenueCard key={index} {...revenue} />
        ))}
      </div>
    </div>
  );
};

export default RevenueSection;
