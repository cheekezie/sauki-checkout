import { Target } from "lucide-react";

interface ProgressBarProps {
  title: string;
  currentValue: string;
  targetValue: string;
  startDate: string;
  endDate: string;
  progress: number;
  color: string;
  label?: string;
}

const ProgressBar = ({
  title,
  currentValue,
  targetValue,
  startDate,
  endDate,
  progress,
  color,
  label,
}: ProgressBarProps) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>

      {/* Values */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{currentValue}</span>
        <span className="text-slate-600">{targetValue}</span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {label && (
          <div className="absolute top-3 left-0 text-xs text-slate-600 font-medium">
            {label}
          </div>
        )}
      </div>

      {/* Date Range */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{startDate}</span>
        <span>{endDate}</span>
      </div>
    </div>
  );
};

const TargetStatistic = () => {
  const targetData = [
    {
      title: "Target Revenue",
      currentValue: "$201.20",
      targetValue: "$3000",
      startDate: "1 November",
      endDate: "30 November",
      progress: 25,
      color: "bg-primary",
      label: "$1209",
    },
    {
      title: "Target Potential Leads",
      currentValue: "201",
      targetValue: "3000",
      startDate: "1 November",
      endDate: "30 November",
      progress: 20,
      color: "bg-secondary",
      label: "620",
    },
    {
      title: "Target Potential Leads",
      currentValue: "201",
      targetValue: "3000",
      startDate: "1 November",
      endDate: "30 November",
      progress: 20,
      color: "bg-secondary",
      label: "620",
    },
  ];

  return (
    <div className="space-y-6 font-sora">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-dark" />
          <h2 className="text-xl font-semibold text-text">Target Statistic</h2>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-bg/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm space-y-8">
        {targetData.map((target, index) => (
          <ProgressBar key={index} {...target} />
        ))}
      </div>
    </div>
  );
};

export default TargetStatistic;
