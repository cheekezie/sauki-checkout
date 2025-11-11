import {
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  period: string;
}

const MetricCard = ({
  icon: Icon,
  title,
  value,
  change,
  changeType,
  period,
}: MetricCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "bg-primary/10 text-primary";
      case "negative":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="w-3 h-3" />;
      case "negative":
        return <TrendingDown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 w-full h-full">
      {/* Icon */}
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Value and Change */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-xl font-bold text-text">{value}</p>
          <span
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getChangeColor()}`}
          >
            {getChangeIcon()}
            <span>{change}</span>
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-dark md:truncate">{title}</p>
        <p className="text-xs text-dark/70">{period}</p>
      </div>
    </div>
  );
};

interface OverviewMetricsProps {
  totalReceive?: number;
  totalStudents?: number;
  totalFees?: number;
}

const OverviewMetrics = ({ totalReceive, totalStudents, totalFees }: OverviewMetricsProps) => {
  const metrics = [
    {
      icon: DollarSign,
      title: "Total Revenue",
      value: formatCurrency(totalReceive ?? 0),
      change: "0%",
      changeType: "neutral" as const,
      period: "Current period",
    },
    {
      icon: Users,
      title: "Total Students",
      value: String(totalStudents ?? 0),
      change: "0%",
      changeType: "neutral" as const,
      period: "Current period",
    },
    {
      icon: FileText,
      title: "Total Fees",
      value: String(totalFees ?? 0),
      change: "0%",
      changeType: "neutral" as const,
      period: "Current period",
    },
    {
      icon: DollarSign,
      title: "Average Revenue",
      value: totalStudents && totalStudents > 0 
        ? formatCurrency((totalReceive ?? 0) / totalStudents)
        : formatCurrency(0),
      change: "0%",
      changeType: "neutral" as const,
      period: "Per student",
    },
  ];

  return (
    <div className="bg-bg/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm font-sora">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-stretch gap-y-4 gap-x-0">
        {metrics.map((metric, index) => {
          const leftBorderForMd =
            index % 2 !== 0 ? "md:border-l md:border-slate-200/60" : "";
          const leftBorderForXl =
            index % 4 !== 0 ? "xl:border-l xl:border-slate-200/60" : "";
          return (
            <div
              key={index}
              className={`${leftBorderForMd} ${leftBorderForXl} pl-0 h-full`}
            >
              <MetricCard {...metric} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewMetrics;
