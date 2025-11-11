import ReactECharts from "echarts-for-react";
import { Filter, ChevronDown } from "lucide-react";

const RealTimeUpdate = () => {
  // Data based on the image description - 23 data points (0-22)
  const withdrawalData = [
    26.5, 27.0, 27.3, 27.8, 28.0, 28.3, 28.5, 28.7, 28.8, 28.6, 28.3, 28.0,
    27.5, 27.0, 26.5, 26.2, 25.8, 26.0, 26.3, 26.8, 27.0, 26.5, 25.8,
  ];

  const depositData = [
    25.5, 26.0, 26.5, 27.0, 26.8, 26.5, 26.2, 26.0, 25.8, 25.5, 25.6, 26.8,
    26.5, 26.2, 25.8, 25.5, 25.6, 27.5, 27.3, 27.0, 26.8, 26.5, 26.5,
  ];

  const xAxisData = Array.from({ length: 23 }, (_, i) => i.toString());

  const chartOption = {
    grid: {
      left: "50px",
      right: "50px",
      top: "60px",
      bottom: "80px",
      containLabel: false,
    },
    xAxis: {
      type: "category",
      data: xAxisData,
      boundaryGap: false,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#e2e8f0",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: "#64748b",
        fontSize: 11,
        formatter: (value: string) => {
          const num = parseInt(value);
          return num % 2 === 0 ? num.toString() : "";
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#f1f5f9",
          type: "dashed",
        },
      },
    },
    yAxis: {
      type: "value",
      min: 25,
      max: 29,
      interval: 1,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#e2e8f0",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: "#64748b",
        fontSize: 11,
        formatter: (value: number) => value.toString(),
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#f1f5f9",
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "Withdrawal",
        type: "line",
        data: withdrawalData,
        smooth: true,
        lineStyle: {
          color: "#FFD47D",
          width: 2.5,
        },
        itemStyle: {
          color: "#FFD47D",
        },
        symbol: "circle",
        symbolSize: 0,
        showSymbol: false,
      },
      {
        name: "Deposit",
        type: "line",
        data: depositData,
        smooth: true,
        lineStyle: {
          color: "#F6A71A",
          width: 2.5,
        },
        itemStyle: {
          color: "#F6A71A",
        },
        symbol: "circle",
        symbolSize: 0,
        showSymbol: false,
      },
    ],
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e2e8f0",
      borderWidth: 1,
      textStyle: {
        color: "#1e293b",
      },
    },
    legend: {
      show: true,
      bottom: 10,
      left: "center",
      itemGap: 30,
      itemWidth: 10,
      itemHeight: 10,
      backgroundColor: "rgba(255, 212, 125, 0.1)",
      padding: [8, 20],
      borderRadius: 8,
      textStyle: {
        color: "#64748b",
        fontSize: 12,
      },
      data: [
        {
          name: "Withdrawal",
          icon: "circle",
          itemStyle: {
            color: "#FFD47D",
          },
        },
        {
          name: "Deposit",
          icon: "circle",
          itemStyle: {
            color: "#F6A71A",
          },
        },
        {
          name: "Payment",
          icon: "circle",
          itemStyle: {
            color: "#94a3b8",
          },
        },
      ],
    },
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-secondary">
          Real-Time Update
        </h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600">Filter By:</span>
            <span className="text-sm font-medium text-slate-700">Date</span>
            <ChevronDown className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <ReactECharts
          option={chartOption}
          style={{ height: "400px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default RealTimeUpdate;
