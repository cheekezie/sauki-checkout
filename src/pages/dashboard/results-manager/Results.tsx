import { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Settings,
  Upload,
  ChevronDown,
  MoreVertical,
  Eye,
  Trash2,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddResultModal from "../../../components/modals/AddResultModal";
import BulkUploadModal from "../../../components/modals/BulkUploadModal";
import SmartDropdown from "../../../components/ui/SmartDropdown";
import FilterModal from "../../../components/ui/FilterModal";
import type {
  DataTableColumn,
  DataTableFilter,
} from "../../../interface/ui.interface";

interface ResultData {
  id: string;
  sn: number;
  year: string;
  term: string;
  examType: string;
  status: "Pending" | "Completed" | "Missed";
  results: string;
  dateCreated: string;
  selected: boolean;
}

const Results = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<DataTableFilter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [resultData, setResultData] = useState<ResultData[]>([
    {
      id: "1",
      sn: 1,
      year: "2024 / 2025",
      term: "First Term",
      examType: "Standard",
      status: "Pending",
      results: "70 / 68",
      dateCreated: "Jan 13, 2025",
      selected: true,
    },
    {
      id: "2",
      sn: 2,
      year: "2024 / 2025",
      term: "Third Term",
      examType: "Common Entrance",
      status: "Completed",
      results: "70 / 68",
      dateCreated: "Jan 13, 2025",
      selected: false,
    },
    {
      id: "3",
      sn: 2,
      year: "2024 / 2025",
      term: "Second Term",
      examType: "POST-UTME",
      status: "Completed",
      results: "70 / 68",
      dateCreated: "Jan 13, 2025",
      selected: false,
    },
    {
      id: "4",
      sn: 2,
      year: "2024 / 2025",
      term: "First Term",
      examType: "Standard",
      status: "Completed",
      results: "70 / 68",
      dateCreated: "Jan 13, 2025",
      selected: false,
    },
    {
      id: "5",
      sn: 2,
      year: "2024 / 2025",
      term: "Third Term",
      examType: "Standard",
      status: "Completed",
      results: "70 / 68",
      dateCreated: "Jan 13, 2025",
      selected: false,
    },
    {
      id: "6",
      sn: 2,
      year: "2024 / 2025",
      term: "Second Term",
      examType: "Standard",
      status: "Missed",
      results: "N/A",
      dateCreated: "Jan 13, 2025",
      selected: false,
    },
    {
      id: "7",
      sn: 2,
      year: "2024 / 2025",
      term: "First Term",
      examType: "Common Entrance",
      status: "Completed",
      results: "70 / 68",
      dateCreated: "Jan 13, 2025",
      selected: false,
    },
    {
      id: "8",
      sn: 2,
      year: "2024 / 2025",
      term: "Third Term",
      examType: "POST-UTME",
      status: "Completed",
      results: "70 / 68",
      dateCreated: "Jan 13, 2025",
      selected: false,
    },
  ]);

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const handleToggleCheckbox = (id: string) => {
    setResultData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = resultData.every((item) => item.selected);
    setResultData((prev) =>
      prev.map((item) => ({ ...item, selected: !allSelected }))
    );
  };

  const allSelected =
    resultData.length > 0 && resultData.every((item) => item.selected);
  const someSelected = resultData.some((item) => item.selected);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  const toggleDropdown = (id: string) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600";
      case "Pending":
        return "text-gray-500";
      case "Missed":
        return "text-red-600";
      default:
        return "text-gray-800";
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "Pending":
        return "bg-gray-400";
      case "Missed":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const handleSaveResult = (_data: any) => {
    // integrate with API later
  };

  // Filter columns definition
  const filterColumns: DataTableColumn[] = [
    {
      key: "year",
      title: "Year",
      filterable: true,
      filterType: "text",
    },
    {
      key: "term",
      title: "Term",
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "First Term", label: "First Term" },
        { value: "Second Term", label: "Second Term" },
        { value: "Third Term", label: "Third Term" },
      ],
    },
    {
      key: "examType",
      title: "Exam Type",
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "Standard", label: "Standard" },
        { value: "Common Entrance", label: "Common Entrance" },
        { value: "POST-UTME", label: "POST-UTME" },
      ],
    },
    {
      key: "status",
      title: "Status",
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "Pending", label: "Pending" },
        { value: "Completed", label: "Completed" },
        { value: "Missed", label: "Missed" },
      ],
    },
    {
      key: "dateCreated",
      title: "Date Created",
      filterable: true,
      filterType: "date",
    },
  ];

  // Apply filters to data
  const filteredData = useMemo(() => {
    let filtered = [...resultData];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply column filters
    activeFilters.forEach((filter) => {
      if (
        filter.value !== null &&
        filter.value !== undefined &&
        filter.value !== ""
      ) {
        filtered = filtered.filter((item) => {
          const value = item[filter.key as keyof ResultData];
          switch (filter.type) {
            case "text":
              return (
                value &&
                String(value)
                  .toLowerCase()
                  .includes(String(filter.value).toLowerCase())
              );
            case "select":
              return value === filter.value;
            case "date":
              return (
                new Date(String(value)).toDateString() ===
                new Date(String(filter.value)).toDateString()
              );
            default:
              return true;
          }
        });
      }
    });

    return filtered;
  }, [resultData, searchTerm, activeFilters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Results</h1>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-end gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4" />
            Grading Key
          </button>
          <SmartDropdown
            trigger={
              <button className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                <Upload className="w-4 h-4" />
                Upload Result
                <ChevronDown className="w-4 h-4" />
              </button>
            }
            options={[
              {
                label: "Single Result",
                icon: Plus,
                onClick: () => setIsAddModalOpen(true),
              },
              {
                label: "Bulk Result",
                icon: Upload,
                onClick: () => setIsBulkModalOpen(true),
              },
            ]}
          />
        </div>

        {/* Search Bar with Filter and Export */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
                  Year
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Term
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Exam Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Result(s)
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Date Created
                </th>
                <th className="text-left py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => {
                    // Open statistics dashboard as child of results
                    navigate(`/dashboard/results/statistics`);
                  }}
                  className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    item.selected ? "bg-pink-50" : ""
                  }`}
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
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.year}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.term}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.examType}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-sm font-medium flex items-center gap-1 ${getStatusColor(
                        item.status
                      )}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusDotColor(
                          item.status
                        )}`}
                      ></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.results}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.dateCreated}
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
                          View Batch
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Export CSV
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete
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

      {/* Modals */}
      <AddResultModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
        onSave={handleSaveResult}
      />
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSave={() => {}}
        templateName="Results_Upload"
        downloadTemplate={() => {
          const templateContent = `Student Reg Number,Subject,Test Score,Exam Score,Total Grade
STU001,English Language,25/30,60/70,85
STU002,Mathematics,20/30,55/70,75
STU003,Physics,28/30,65/70,93
STU004,Chemistry,22/30,58/70,80
STU005,Biology,24/30,62/70,86`;

          const blob = new Blob([templateContent], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "Results_Upload_Template.csv";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }}
        confirmationTitle="Upload Successful"
        confirmationMessage="Results have been successfully uploaded."
      />
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        columns={filterColumns}
        activeFilters={activeFilters}
        onApplyFilters={(filters) => setActiveFilters(filters)}
        onClearFilters={() => setActiveFilters([])}
      />
    </div>
  );
};

export default Results;
