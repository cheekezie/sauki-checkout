import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
} from "lucide-react";

interface StudentData {
  id: string;
  sn: number;
  studentName: string;
  registrationNo: string;
  totalMarks: number | string;
  position: number | string;
  status: "Passed" | "Failed" | "Fetching";
  selected: boolean;
}

interface ExpandedStudentData {
  id: string;
  sn: number;
  studentName: string;
  registrationNo: string;
  examClass: string;
  term: string;
  marksObtainable: number;
  marksScored: number;
  percentage: number;
  passedFailed: "Passed" | "Failed";
  englishLang1: number;
  englishLang2: number;
  englishLang3: number;
  englishLang4: number;
  selected: boolean;
}

const ClassResults = () => {
  const navigate = useNavigate();
  const { className } = useParams<{ className: string }>();
  const decodedClassName = className
    ? decodeURIComponent(className)
    : "Primary 2";
  const term = "Third Term 2024 / 2025";

  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "expanded">("overview");
  const [expandedData, setExpandedData] = useState<ExpandedStudentData[]>([
    {
      id: "1",
      sn: 1,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      examClass: "JS2",
      term: "2nd Term",
      marksObtainable: 1600,
      marksScored: 790,
      percentage: 54.5,
      passedFailed: "Passed",
      englishLang1: 45,
      englishLang2: 45,
      englishLang3: 45,
      englishLang4: 45,
      selected: false,
    },
    {
      id: "2",
      sn: 2,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      examClass: "JS2",
      term: "2nd Term",
      marksObtainable: 790,
      marksScored: 790,
      percentage: 54.5,
      passedFailed: "Passed",
      englishLang1: 87,
      englishLang2: 87,
      englishLang3: 87,
      englishLang4: 87,
      selected: false,
    },
    {
      id: "3",
      sn: 3,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      examClass: "JS2",
      term: "2nd Term",
      marksObtainable: 790,
      marksScored: 790,
      percentage: 54.5,
      passedFailed: "Passed",
      englishLang1: 45,
      englishLang2: 45,
      englishLang3: 45,
      englishLang4: 45,
      selected: false,
    },
    {
      id: "4",
      sn: 4,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      examClass: "JS2",
      term: "2nd Term",
      marksObtainable: 790,
      marksScored: 450,
      percentage: 57.0,
      passedFailed: "Passed",
      englishLang1: 50,
      englishLang2: 50,
      englishLang3: 50,
      englishLang4: 50,
      selected: false,
    },
    {
      id: "5",
      sn: 5,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      examClass: "JS2",
      term: "2nd Term",
      marksObtainable: 790,
      marksScored: 600,
      percentage: 75.9,
      passedFailed: "Passed",
      englishLang1: 90,
      englishLang2: 90,
      englishLang3: 90,
      englishLang4: 90,
      selected: false,
    },
  ]);

  const [studentData, setStudentData] = useState<StudentData[]>([
    {
      id: "1",
      sn: 1,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      totalMarks: "N/A",
      position: "N/A",
      status: "Fetching",
      selected: true,
    },
    {
      id: "2",
      sn: 2,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      totalMarks: 650,
      position: 4,
      status: "Passed",
      selected: false,
    },
    {
      id: "3",
      sn: 3,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      totalMarks: 650,
      position: 5,
      status: "Passed",
      selected: false,
    },
    {
      id: "4",
      sn: 4,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      totalMarks: 234,
      position: 54,
      status: "Failed",
      selected: false,
    },
    {
      id: "5",
      sn: 5,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      totalMarks: 580,
      position: 12,
      status: "Passed",
      selected: false,
    },
    {
      id: "6",
      sn: 6,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      totalMarks: 720,
      position: 2,
      status: "Passed",
      selected: false,
    },
    {
      id: "7",
      sn: 7,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      totalMarks: 680,
      position: 8,
      status: "Passed",
      selected: false,
    },
    {
      id: "8",
      sn: 8,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      totalMarks: 590,
      position: 15,
      status: "Passed",
      selected: false,
    },
    {
      id: "9",
      sn: 9,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      totalMarks: 510,
      position: 25,
      status: "Passed",
      selected: false,
    },
    {
      id: "10",
      sn: 10,
      studentName: "Harrison Chike",
      registrationNo: "EN456789",
      totalMarks: 490,
      position: 30,
      status: "Failed",
      selected: false,
    },
  ]);

  const handleToggleCheckbox = (id: string) => {
    if (viewMode === "overview") {
      setStudentData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, selected: !item.selected } : item
        )
      );
    } else {
      setExpandedData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, selected: !item.selected } : item
        )
      );
    }
  };

  const handleSelectAll = () => {
    if (viewMode === "overview") {
      const allSelected = studentData.every((item) => item.selected);
      setStudentData((prev) =>
        prev.map((item) => ({ ...item, selected: !allSelected }))
      );
    } else {
      const allSelected = expandedData.every((item) => item.selected);
      setExpandedData((prev) =>
        prev.map((item) => ({ ...item, selected: !allSelected }))
      );
    }
  };

  const toggleDropdown = (id: string) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const allSelected =
    viewMode === "overview"
      ? studentData.length > 0 && studentData.every((item) => item.selected)
      : expandedData.length > 0 && expandedData.every((item) => item.selected);
  const someSelected =
    viewMode === "overview"
      ? studentData.some((item) => item.selected)
      : expandedData.some((item) => item.selected);
  const headerCheckboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected, viewMode]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Passed":
        return "text-green-600";
      case "Failed":
        return "text-red-600";
      case "Fetching":
        return "text-gray-500";
      default:
        return "text-gray-800";
    }
  };

  const population = 54;
  const avgScore = 456;
  const passCount = 13;
  const failCount = 2;

  return (
    <div className="bg-gray-50 p-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard/statistics")}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {term} {decodedClassName}
            </h1>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-xs text-gray-600 mb-1">Population</p>
            <p className="text-2xl font-bold text-gray-800">{population}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-xs text-gray-600 mb-1">Avg. Score</p>
            <p className="text-2xl font-bold text-gray-800">{avgScore}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-xs text-gray-600 mb-1">Pass vs Fail</p>
            <p className="text-2xl font-bold text-gray-800">
              {passCount} / {failCount}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-xs text-gray-600 mb-1">
              Best Performing Subject
            </p>
            <p className="text-lg font-semibold text-gray-800">English Lang</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-xs text-gray-600 mb-1">
              Worst Performing Subject
            </p>
            <p className="text-lg font-semibold text-gray-800">French Lang</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-xs text-gray-600 mb-1">
              Best Performing Student
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Harrison Chike
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* View Toggle */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setViewMode("overview")}
              className={`flex-1 pb-3 pt-4 px-4 text-sm font-medium transition-colors text-center ${
                viewMode === "overview"
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode("expanded")}
              className={`flex-1 pb-3 pt-4 px-4 text-sm font-medium transition-colors text-center ${
                viewMode === "expanded"
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Expanded view
            </button>
          </div>
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {viewMode === "overview" ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        ref={headerCheckboxRef}
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      S/No.
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Student Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Registration No.
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Total marks Scored
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Position in Class
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((item) => (
                    <tr
                      onClick={() =>
                        navigate(`/dashboard/results/student/${item.id}`)
                      }
                      key={item.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        item.selected ? "bg-pink-50" : ""
                      } cursor-pointer`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleToggleCheckbox(item.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {String(item.sn).padStart(3, "0")}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                        {item.studentName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.registrationNo}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.totalMarks}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.position}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          • {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(item.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        {showDropdown === item.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View Student Result
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Export PDF
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        ref={headerCheckboxRef}
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      S/N
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Student Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Registration No.
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Exam Class
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Term
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Marks Obtainable
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Marks Scored
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Percentage (%)
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Passed / Failed
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      English Lang
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      English Lang
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      English Lang
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      English Lang
                    </th>
                    <th className="text-left py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {expandedData.map((item) => (
                    <tr
                      onClick={() =>
                        navigate(`/dashboard/results/student/${item.id}`)
                      }
                      key={item.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        item.selected ? "bg-pink-50" : ""
                      } cursor-pointer`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleToggleCheckbox(item.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.sn}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                        {item.studentName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.registrationNo}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.examClass}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.term}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.marksObtainable}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.marksScored}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.percentage}%
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm font-medium ${
                            item.passedFailed === "Passed"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.passedFailed}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.englishLang1}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.englishLang2}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.englishLang3}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {item.englishLang4}
                      </td>
                      <td className="py-3 px-4 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(item.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        {showDropdown === item.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View Student Result
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Export PDF
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
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
                onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
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
  );
};

export default ClassResults;
