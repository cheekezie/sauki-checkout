import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

interface StatsCardProps {
  totalRevenue?: number;
  transactions?: number;
  avgPaymentValue?: number;
}

const StatsCard = ({
  totalRevenue = 34000000,
  transactions = 1550,
  avgPaymentValue = 750,
}: StatsCardProps) => {
  // Line graph data for Total Revenue - upward trending
  const revenueChartData = [25, 28, 26, 29, 27, 30, 28, 32, 30, 33, 31, 34];

  // Line graph data for Transactions - fluctuating with downward trend
  const transactionsChartData = [
    80, 75, 82, 70, 78, 65, 72, 68, 70, 65, 68, 60,
  ];

  // Line graph data for Avg Payment Value - upward trending
  const avgPaymentChartData = [20, 22, 21, 24, 23, 26, 25, 28, 27, 30, 29, 32];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Column 1 - Total Revenue */}
      <div className="bg-secondary rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-sm font-medium text-white/90 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold mb-3">
            {formatCurrency(totalRevenue)}
          </p>
          <div className="flex items-center gap-1 text-sm text-white/90">
            <TrendingUp className="w-4 h-4" />
            <span>30% than last month</span>
          </div>
        </div>
        {/* Mini Line Graph */}
        <div className="absolute right-4 bottom-4 w-32 h-16">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 120 60"
            preserveAspectRatio="none"
            className="text-white"
          >
            <polyline
              points={revenueChartData
                .map((val, i) => {
                  const x = (i * 120) / (revenueChartData.length - 1);
                  const y = 60 - ((val - 25) / (34 - 25)) * 50;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>

      {/* Column 2 - Transactions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-sm font-medium text-secondary mb-2">
            Transactions
          </h3>
          <p className="text-3xl font-bold text-secondary mb-3">
            {transactions.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span>30% than last month</span>
          </div>
        </div>
        {/* Mini Line Graph with Area Fill */}
        <div className="absolute right-4 top-4 w-32 h-20">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 120 60"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="transactionsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.3)" />
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d={`M 0,60 ${transactionsChartData
                .map((val, i) => {
                  const x = (i * 120) / (transactionsChartData.length - 1);
                  const y = 60 - ((val - 50) / (90 - 50)) * 50;
                  return `L ${x},${y}`;
                })
                .join(" ")} L 120,60 Z`}
              fill="url(#transactionsGradient)"
            />
            {/* Line */}
            <polyline
              points={transactionsChartData
                .map((val, i) => {
                  const x = (i * 120) / (transactionsChartData.length - 1);
                  const y = 60 - ((val - 50) / (90 - 50)) * 50;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Column 3 - Avg Payment Value */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-sm font-medium text-secondary mb-2">
            Avg. Payment Value
          </h3>
          <p className="text-3xl font-bold text-secondary mb-3">
            {formatCurrency(avgPaymentValue)}
          </p>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span>30% than last month</span>
          </div>
        </div>
        {/* Mini Line Graph with Area Fill */}
        <div className="absolute right-4 top-4 w-32 h-20">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 120 60"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="avgPaymentGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d={`M 0,60 ${avgPaymentChartData
                .map((val, i) => {
                  const x = (i * 120) / (avgPaymentChartData.length - 1);
                  const y = 60 - ((val - 15) / (35 - 15)) * 50;
                  return `L ${x},${y}`;
                })
                .join(" ")} L 120,60 Z`}
              fill="url(#avgPaymentGradient)"
            />
            {/* Line */}
            <polyline
              points={avgPaymentChartData
                .map((val, i) => {
                  const x = (i * 120) / (avgPaymentChartData.length - 1);
                  const y = 60 - ((val - 15) / (35 - 15)) * 50;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
