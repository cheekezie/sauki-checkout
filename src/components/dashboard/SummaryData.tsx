import { BarChart3, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";

interface SummaryMetricProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

const SummaryMetric = ({
  title,
  value,
  change,
  changeType = "neutral",
}: SummaryMetricProps) => {
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
    <div className="bg-white/60 backdrop-blur-xl rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <h4 className="text-sm font-medium text-slate-600 mb-2">{title}</h4>
      <p className="text-xl font-bold text-slate-800 mb-2">{value}</p>
      {change && (
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getChangeColor()}`}
          >
            {getChangeIcon()}
            <span>{change}</span>
          </span>
        </div>
      )}
    </div>
  );
};

const SummaryData = () => {
  const summaryMetrics = [
    {
      title: "Leads Penetration",
      value: "50.000",
      change: "30.5%",
      changeType: "positive" as const,
    },
    {
      title: "Total Potential Leads",
      value: "100.000",
    },
    {
      title: "Class Penetration",
      value: "650",
      change: "30.5%",
      changeType: "negative" as const,
    },
    {
      title: "Total Potential Class",
      value: "2.000",
    },
    {
      title: "Total Revenue",
      value: "$1500",
      change: "10.5%",
      changeType: "positive" as const,
    },
    {
      title: "Lead CR",
      value: "60%",
    },
  ];

  return (
    <div className="space-y-6 font-sora">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-dark" />
          <h2 className="text-xl font-semibold text-text">Summary Data</h2>
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 bg-bg/60 backdrop-blur-xl border border-offwhite rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>2022-2023</option>
            <option>2021-2022</option>
            <option>2020-2021</option>
          </select>
          <button className="p-2 rounded-lg text-dark hover:text-primary hover:bg-primary/10 transition-colors">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {summaryMetrics.map((metric, index) => (
          <SummaryMetric key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default SummaryData;
