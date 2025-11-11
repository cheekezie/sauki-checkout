import React, { useRef } from "react";
import ReactECharts from "echarts-for-react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
} from "lucide-react";

interface ClassData {
  id: string;
  class: string;
  population: number;
  avgScore: number;
  selected: boolean;
}

const StatisticsDashboard = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Disable scrolling on the parent main element
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.style.overflow = "hidden";
    }
    return () => {
      if (mainElement) {
        mainElement.style.overflow = "";
      }
    };
  }, []);

  const lineChartRef = useRef<ReactECharts>(null);
  const donutChartRef = useRef<ReactECharts>(null);
  const gradeBarChartRef = useRef<ReactECharts>(null);
  const classBarChartRef = useRef<ReactECharts>(null);
  const subjectBarChartRef = useRef<ReactECharts>(null);
  const gaugeChartRef = useRef<ReactECharts>(null);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const [classData, setClassData] = React.useState<ClassData[]>([
    { id: "1", class: "Pry 2", population: 54, avgScore: 345, selected: true },
    { id: "2", class: "Pry 3", population: 54, avgScore: 345, selected: false },
    { id: "3", class: "JSS 2", population: 54, avgScore: 345, selected: false },
    { id: "4", class: "JSS 3", population: 54, avgScore: 345, selected: false },
    { id: "5", class: "Pry 1", population: 48, avgScore: 320, selected: false },
    { id: "6", class: "Pry 4", population: 52, avgScore: 365, selected: false },
    { id: "7", class: "Pry 5", population: 50, avgScore: 380, selected: false },
    { id: "8", class: "Pry 6", population: 56, avgScore: 390, selected: false },
    { id: "9", class: "JSS 1", population: 60, avgScore: 350, selected: false },
    {
      id: "10",
      class: "SSS 1",
      population: 45,
      avgScore: 400,
      selected: false,
    },
  ]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [showDropdown, setShowDropdown] = React.useState<string | null>(null);

  // Line Chart Configuration
  const lineChartOption = {
    grid: { left: "10%", right: "10%", top: "15%", bottom: "15%" },
    xAxis: {
      type: "category",
      data: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
      ],
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      type: "value",
      show: false,
      min: 30,
      max: 90,
    },
    series: [
      {
        data: [
          33, 78, 36, 60, 43, 62, 43, 82, 68, 74, 50, 78, 36, 70, 65, 70, 43,
          82, 68, 74, 80,
        ],
        type: "line",
        smooth: false,
        lineStyle: {
          color: "#EC4899",
          width: 2,
        },
        itemStyle: {
          color: "#EC4899",
        },
        symbol: "circle",
        symbolSize: 4,
        showSymbol: true,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(236, 72, 153, 0.3)" },
              { offset: 1, color: "rgba(236, 72, 153, 0)" },
            ],
          },
        },
      },
    ],
  };

  // Donut Chart Configuration
  const donutChartOption = {
    series: [
      {
        name: "Student Above Average",
        type: "pie",
        radius: ["60%", "75%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            color: "#9CA3AF",
          },
        },
        label: {
          show: true,
          position: "center",
          fontSize: 16,
          fontWeight: "bold",
          color: "#EC4899",
          formatter: "12.5%",
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 12.5, itemStyle: { color: "#EC4899" } },
          { value: 87.5, itemStyle: { color: "#FCE7F3" } },
        ],
      },
    ],
  };

  // Grade Distribution Bar Chart
  const gradeBarChartOption = {
    backgroundColor: "#ffffff",
    grid: { left: "15%", right: "10%", top: "10%", bottom: "20%" },
    xAxis: {
      type: "category",
      data: ["500 - C", "350 - E", "300 - D", "14 - B"],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        rotate: -90,
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        data: [
          { value: 800, itemStyle: { color: "#EC4899" } },
          { value: 700, itemStyle: { color: "#F9A8D4" } },
          { value: 500, itemStyle: { color: "#FCE7F3" } },
          { value: 300, itemStyle: { color: "#FCE7F3" } },
        ],
        type: "bar",
        barWidth: "60%",
        emphasis: {
          itemStyle: {
            color: "#9CA3AF",
          },
        },
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 150, 150, 0.4)",
        },
      },
    ],
  };

  // Class Avg Performance Bar Chart
  const classBarChartOption = {
    grid: { left: "15%", right: "10%", top: "10%", bottom: "15%" },
    xAxis: {
      type: "category",
      data: [
        "JSS1",
        "JSS2",
        "SSS1",
        "SSS2",
        "PRY2",
        "PRY3",
        "PRY4",
        "168",
        "JSS3",
      ],
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      show: true,
      axisLine: { show: true },
    },
    series: [
      {
        data: [
          { value: 320, itemStyle: { color: "#FCE7F3" } },
          { value: 380, itemStyle: { color: "#FCE7F3" } },
          { value: 350, itemStyle: { color: "#FCE7F3" } },
          { value: 400, itemStyle: { color: "#FCE7F3" } },
          { value: 420, itemStyle: { color: "#FCE7F3" } },
          { value: 410, itemStyle: { color: "#FCE7F3" } },
          { value: 390, itemStyle: { color: "#FCE7F3" } },
          { value: 370, itemStyle: { color: "#FCE7F3" } },
          { value: 450, itemStyle: { color: "#EC4899" } },
        ],
        type: "bar",
        barWidth: "40%",
        emphasis: {
          itemStyle: {
            color: "#9CA3AF",
          },
        },
      },
    ],
  };

  // Subject Distribution Horizontal Bar Chart
  const subjectBarChartOption = {
    grid: { left: "20%", right: "10%", top: "10%", bottom: "10%" },
    xAxis: {
      type: "value",
      show: false,
    },
    yAxis: {
      type: "category",
      data: ["ENGLISH", "MATHS", "HISTORY", "SCIENCES"],
      axisLine: { show: false },
      axisTick: { show: false },
      inverse: true,
    },
    series: [
      {
        data: [
          { value: 450, itemStyle: { color: "#FCE7F3" } },
          { value: 380, itemStyle: { color: "#FCE7F3" } },
          { value: 300, itemStyle: { color: "#FCE7F3" } },
          { value: 250, itemStyle: { color: "#FCE7F3" } },
        ],
        type: "bar",
        barWidth: "30%",
        emphasis: {
          itemStyle: {
            color: "#9CA3AF",
          },
        },
      },
    ],
  };

  // Gauge Chart Configuration
  const gaugeChartOption = {
    series: [
      {
        name: "General Performance",
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        center: ["50%", "65%"],
        radius: "90%",
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.8, "#FCE7F3"],
              [1, "#E5E7EB"],
            ],
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          length: 8,
          lineStyle: {
            color: "#999",
            width: 1,
          },
        },
        axisLabel: {
          show: true,
          distance: -40,
          fontSize: 12,
          formatter: "{value}",
        },
        pointer: {
          show: true,
          length: "70%",
          width: 3,
          itemStyle: {
            color: "#EC4899",
          },
        },
        detail: {
          show: false,
        },
        data: [
          {
            value: 23,
          },
        ],
      },
    ],
  };

  const handleToggleCheckbox = (id: string) => {
    setClassData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = classData.every((item) => item.selected);
    setClassData((prev) =>
      prev.map((item) => ({ ...item, selected: !allSelected }))
    );
  };

  const allSelected =
    classData.length > 0 && classData.every((item) => item.selected);
  const someSelected = classData.some((item) => item.selected);

  React.useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  const toggleDropdown = (id: string) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const handleViewClass = (className: string) => {
    // Navigate to class results page
    navigate(`/dashboard/results/class/${encodeURIComponent(className)}`);
    setShowDropdown(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary tracking-tight">
              Statistics Dashboard
            </h1>
          </div>
        </div>

          <div className="mb-3 flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate("/dashboard/results")}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              Third Term 2024 / 2025
            </h1>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-4 flex flex-col">
              {/* Top Card - Three Small Charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-shrink-0">
                {/* Line Chart */}
                <div className="bg-white rounded-lg shadow-sm p-3">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-gray-600">Avg. Score in Maths</p>
                    <span className="text-md font-bold text-pink-500">
                      76.5%
                    </span>
                  </div>
                  <ReactECharts
                    ref={lineChartRef}
                    option={lineChartOption}
                    style={{ height: "100px", width: "100%" }}
                  />
                </div>

                {/* Donut Chart */}
                <div className="bg-white rounded-lg shadow-sm p-3">
                  <p className="text-xs text-start text-gray-600 mb-1">
                    Student Above Average
                  </p>
                  <ReactECharts
                    ref={donutChartRef}
                    option={donutChartOption}
                    style={{ height: "100px", width: "100%" }}
                  />
                </div>

                {/* Grade Distribution Bar Chart */}
                <div className="bg-white rounded-lg shadow-sm p-3">
                  <p className="text-xs text-start text-gray-600 mb-1">
                    Grade distribution
                  </p>
                  <ReactECharts
                    ref={gradeBarChartRef}
                    option={gradeBarChartOption}
                    style={{ height: "100px", width: "100%" }}
                  />
                </div>
              </div>

              {/* Middle Card - Class Avg Performance */}
              <div className="bg-white rounded-lg shadow-sm p-3 flex-shrink-0">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Class Avg. Performance
                </h3>
                <ReactECharts
                  ref={classBarChartRef}
                  option={classBarChartOption}
                  style={{ height: "180px", width: "100%" }}
                />
              </div>

              {/* Bottom Card - Subject distribution and General Performance */}
              <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Subject Distribution */}
                  <div className="bg-white p-2 md:p-3">
                    <p className="text-xs text-start text-gray-600 mb-1">
                      Subject distribution
                    </p>
                    <ReactECharts
                      ref={subjectBarChartRef}
                      option={subjectBarChartOption}
                      style={{ height: "140px", width: "100%" }}
                    />
                  </div>

                  {/* General Performance (Gauge) */}
                  <div className="bg-white p-2 md:p-3 pt-3 flex flex-col items-center justify-center">
                    <p className="text-xs text-start text-gray-600 self-start mb-1">
                      General Performance
                    </p>
                    <ReactECharts
                      ref={gaugeChartRef}
                      option={gaugeChartOption}
                      style={{ height: "140px", width: "100%" }}
                    />
                    <div className="text-center -mt-10">
                      <span className="text-xs text-gray-800">
                        {23 + "/" + 100}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Data Table */}
            <div className="bg-white rounded-lg shadow-sm p-3 flex flex-col">
              {/* Table Header */}
              <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <button className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-2 px-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={allSelected}
                          onChange={handleSelectAll}
                          ref={headerCheckboxRef}
                        />
                      </th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <span>Class</span>
                        {/* <Minus className="w-3 h-3" /> */}
                      </th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700">
                        Population
                      </th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700">
                        Avg. Score
                      </th>
                      <th className="text-left py-2 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {classData.map((item) => (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          item.selected ? "bg-pink-50" : ""
                        }`}
                      >
                        <td className="py-2 px-2">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleToggleCheckbox(item.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="py-2 px-2 text-xs text-gray-800 font-medium">
                          {item.class}
                        </td>
                        <td className="py-2 px-2 text-xs text-gray-800">
                          {item.population}
                        </td>
                        <td className="py-2 px-2 text-xs text-gray-800">
                          {item.avgScore}
                        </td>
                        <td className="py-2 px-2 relative">
                          <button
                            onClick={() => toggleDropdown(item.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <MoreVertical className="w-3 h-3 text-gray-600" />
                          </button>
                          {showDropdown === item.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                              <button
                                onClick={() => handleViewClass(item.class)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Class
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Export CSV
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of 10
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(10, currentPage + 1))
                    }
                    disabled={currentPage === 10}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default StatisticsDashboard;
