import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const StudentReport: React.FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">(
    "overview"
  );

  const rows = Array.from({ length: 7 }).map((_, idx) => ({
    sn: idx + 1,
    subject: "English language",
    ca1: 1600,
    ca2: 790,
    exam: 45,
    total: 45,
    grade: 45,
    remark: "Passed",
  }));

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-pink-600 text-white hover:bg-pink-700">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>

        {/* Identity Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-2">
              <img
                src="/jasiri-logo.png"
                alt="Jasiri school logo"
                className="w-20 rounded-md object-cover "
              />
              <div>
                {/* <h2 className="text-xl font-semibold text-gray-900">Jasiri</h2> */}
                <p className="text-xs text-gray-600">
                  Jasiri College of Technology Nigeria.
                </p>
                <p className="text-xs text-gray-600">
                  15, Borno Close, Off 2nd Ave. Gwarimpa, Abuja.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-600">EN{studentId}</p>
                <p className="text-sm font-medium text-gray-900">
                  Kenneth Adebola
                </p>
                <span className="text-xs text-green-600">Passed</span>
              </div>
              <img
                src="/avatar.png"
                alt="Student avatar"
                className="w-14 h-16 rounded-xl object-cover border border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "analytics"
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Analytics
            </button>
          </div>

          {activeTab === "overview" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
              {/* Left - Assessment Summary */}
              <div className="lg:col-span-2">
                <div className="border rounded-lg overflow-hidden">
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                    Assessment Summary
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="py-3 px-4">S/N</th>
                          <th className="py-3 px-4">Subject</th>
                          <th className="py-3 px-4">CA 1 (20)</th>
                          <th className="py-3 px-4">CA 2 (20)</th>
                          <th className="py-3 px-4">Exam (60)</th>
                          <th className="py-3 px-4">Total (100)</th>
                          <th className="py-3 px-4">Grade</th>
                          <th className="py-3 px-4">Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r) => (
                          <tr key={r.sn} className="border-t">
                            <td className="py-3 px-4">{r.sn}</td>
                            <td className="py-3 px-4">{r.subject}</td>
                            <td className="py-3 px-4">{r.ca1}</td>
                            <td className="py-3 px-4">{r.ca2}</td>
                            <td className="py-3 px-4">{r.exam}</td>
                            <td className="py-3 px-4">{r.total}</td>
                            <td className="py-3 px-4">{r.grade}</td>
                            <td className="py-3 px-4">{r.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Commentary */}
                <div className="mt-4 space-y-3">
                  {[
                    "Very Good Performance",
                    "A Very Quiet Girl",
                    "Mr. Tinubu Bola Ahmed GCFR",
                  ].map((title, idx) => (
                    <div key={idx} className="border rounded-lg">
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                        Commentary
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-800 mb-1">
                          {title}
                        </p>
                        <p className="text-xs text-gray-600">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Overview and Domains */}
              <div className="space-y-4">
                <div className="border rounded-lg">
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                    Overview
                  </div>
                  <div className="px-4 py-3 text-sm text-gray-800 space-y-2">
                    <div className="flex justify-between">
                      <span>Class</span>
                      <span>JSS 2C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Position in Class</span>
                      <span>4th</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Student Avg.</span>
                      <span>340</span>
                    </div>
                    <div className="flex justify-between">
                      <span>No. Days Abs</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pass / Failed</span>
                      <span>Pass</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Term</span>
                      <span>Second Term</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Session</span>
                      <span>2024 / 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Class Size</span>
                      <span>23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Class Avg.</span>
                      <span>500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Term Begins</span>
                      <span>May 5, 2025</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg">
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                    Psychomotor Domain
                  </div>
                  <div className="px-4 py-3 text-sm text-gray-800 space-y-2">
                    {[
                      ["Handwriting / Penmanship", 2],
                      ["Drawing / Creative Art Skills", 3],
                      ["Coordination in Sports & Physical Activities", 3],
                      ["Practical Work (Science/Technical)", 2],
                      ["Use of Tools and Equipment", 3],
                      ["Musical Skills", 5],
                      ["Craftsmanship", 3],
                    ].map(([k, v]) => (
                      <div key={String(k)} className="flex justify-between">
                        <span>{String(k)}</span>
                        <span>{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg">
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                    Affective Domain
                  </div>
                  <div className="px-4 py-3 text-sm text-gray-800 space-y-2">
                    {[
                      ["Punctuality", 4],
                      ["Attendance / Regularity", 5],
                      ["Neatness / Personal Hygiene", 4],
                      ["Attitude to Work", 4],
                      ["Sense of Responsibility", 4],
                      ["Obedience / Respect for Authority", 0],
                      ["Class Participation", 1],
                    ].map(([k, v]) => (
                      <div key={String(k)} className="flex justify-between">
                        <span>{String(k)}</span>
                        <span>{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg">
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                    Key to Grading
                  </div>
                  <div className="px-4 py-3 text-sm text-gray-800 space-y-1">
                    {[
                      ["70 Above", "EXCELLENT", "A+"],
                      ["66 - 70", "VERY GOOD", "A"],
                      ["51 - 65", "GOOD", "B"],
                      ["45 - 50", "CREDIT", "C"],
                      ["35 - 44", "PASS", "D"],
                      ["34 Below", "FAIL", "F"],
                    ].map(([range, text, grade]) => (
                      <div key={String(range)} className="flex justify-between">
                        <span>{String(range)}</span>
                        <span>{String(text)}</span>
                        <span>{String(grade)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Top Row - Four KPI Cards */}
              <div className="grid grid-cols-4 gap-5">
                {/* Student Avg Donut Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <p className="text-xs text-gray-500 mb-3 font-medium text-center">
                    Student Avg.
                  </p>
                  <ReactECharts
                    option={{
                      backgroundColor: "transparent",
                      series: [
                        {
                          name: "Student Avg.",
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
                    }}
                    style={{ height: "140px", width: "100%" }}
                  />
                </div>

                {/* Avg. Score */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center hover:shadow-md transition-shadow">
                  <p className="text-xs text-gray-500 mb-4 font-medium text-center">
                    Avg. Score
                  </p>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-3xl font-bold text-gray-900 text-center">
                      56%
                    </p>
                  </div>
                </div>

                {/* Class Avg */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center hover:shadow-md transition-shadow">
                  <p className="text-xs text-gray-500 mb-4 font-medium text-center">
                    Class Avg.
                  </p>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-3xl font-bold text-gray-900 text-center">
                      465/54
                    </p>
                  </div>
                </div>

                {/* Subject Index */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center hover:shadow-md transition-shadow">
                  <p className="text-xs text-gray-500 mb-4 font-medium text-center">
                    Subject Index
                  </p>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-3xl font-bold text-gray-900 text-center">
                      8/4
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle Row - Three Column Layout */}
              <div className="grid grid-cols-3 gap-5">
                {/* Left Column - Text Statistics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-sm text-gray-500 font-medium">
                        Student Avg.
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        54
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-sm text-gray-500 font-medium">
                        Position in Class
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        12
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">
                        Subjects Passed
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        4
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center Column - Performance Trend */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                    Performance Trend
                  </p>
                  <ReactECharts
                    option={{
                      backgroundColor: "transparent",
                      grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "3%",
                        top: "10%",
                        containLabel: true,
                      },
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
                            33, 78, 36, 60, 43, 62, 43, 82, 68, 74, 50, 78, 36,
                            70, 65, 70, 43, 82, 68, 74, 80,
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
                          symbolSize: 8,
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
                    }}
                    style={{ height: "180px", width: "100%" }}
                  />
                </div>

                {/* Right Column - Grade Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                    Grade Distribution
                  </p>
                  <ReactECharts
                    option={{
                      backgroundColor: "transparent",
                      grid: {
                        left: "25%",
                        right: "10%",
                        top: "10%",
                        bottom: "10%",
                      },
                      xAxis: {
                        type: "value",
                        axisLine: { show: false },
                        axisTick: { show: false },
                        axisLabel: { show: false },
                        splitLine: { show: false },
                      },
                      yAxis: {
                        type: "category",
                        data: ["A1", "B2", "C4", "D6"],
                        axisLine: { show: false },
                        axisTick: { show: false },
                        axisLabel: { color: "#6B7280", fontSize: 12 },
                      },
                      series: [
                        {
                          type: "bar",
                          data: [85, 75, 50, 35],
                          itemStyle: { color: "#93C5FD" },
                          barWidth: "60%",
                        },
                      ],
                    }}
                    style={{ height: "180px", width: "100%" }}
                  />
                </div>
              </div>

              {/* Bottom Row - Two Column Layout */}
              <div className="grid grid-cols-2 gap-5">
                {/* Left Column - Top 3 Subjects */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <p className="text-sm font-semibold text-gray-700 mb-5 text-center">
                    Top 3 Subjects
                  </p>
                  <div className="space-y-3">
                    {[80, 60, 40].map((value, idx) => (
                      <div key={idx}>
                        <p className="text-xs text-gray-600 mb-2">
                          French Language
                        </p>
                        <ReactECharts
                          option={{
                            backgroundColor: "transparent",
                            grid: {
                              left: "0%",
                              right: "0%",
                              top: "5%",
                              bottom: "5%",
                            },
                            xAxis: {
                              type: "value",
                              max: 100,
                              show: false,
                            },
                            yAxis: {
                              type: "category",
                              data: [""],
                              show: false,
                            },
                            series: [
                              {
                                type: "bar",
                                data: [value],
                                itemStyle: { color: "#93C5FD" },
                                barWidth: "100%",
                              },
                            ],
                          }}
                          style={{ height: "30px", width: "100%" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Overall Performance Gauge */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                    Overall Performance
                  </p>
                  <ReactECharts
                    option={{
                      backgroundColor: "transparent",
                      series: [
                        {
                          type: "gauge",
                          startAngle: 180,
                          endAngle: 0,
                          min: 0,
                          max: 100,
                          splitNumber: 10,
                          axisLine: {
                            lineStyle: {
                              width: 12,
                              color: [
                                [23 / 100, "#EC4899"],
                                [1, "#E5E7EB"],
                              ],
                            },
                          },
                          pointer: {
                            length: "70%",
                            width: 4,
                            itemStyle: { color: "#1F2937" },
                          },
                          axisTick: {
                            show: true,
                            length: 8,
                            lineStyle: { color: "#fff", width: 1 },
                          },
                          splitLine: {
                            show: true,
                            length: 12,
                            lineStyle: { color: "#fff", width: 1 },
                          },
                          axisLabel: {
                            show: true,
                            color: "#fff",
                            fontSize: 10,
                            distance: -30,
                            formatter: (value: number) => {
                              if (value % 20 === 0) return value.toString();
                              return "";
                            },
                          },
                          detail: {
                            show: false,
                          },
                          data: [{ value: 23, name: "" }],
                        },
                      ],
                    }}
                    style={{ height: "180px", width: "100%" }}
                  />
                  <div className="text-center mt-4">
                    <p className="text-lg font-semibold text-gray-900">
                      23/100
                    </p>
                    <div className="flex justify-between items-center mt-4 px-4">
                      <span className="text-sm text-gray-500 font-medium">
                        Pass
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        54
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentReport;
