import React, { useState, useEffect } from "react";
import { X, Filter } from "lucide-react";
import { Portal } from "../layout/Portal";
import Button from "./Button";
import type {
  DataTableColumn,
  DataTableFilter,
} from "../../interface/ui.interface";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: DataTableColumn[];
  activeFilters: DataTableFilter[];
  onApplyFilters: (filters: DataTableFilter[]) => void;
  onClearFilters: () => void;
}

const FilterModal = ({
  isOpen,
  onClose,
  columns,
  activeFilters,
  onApplyFilters,
  onClearFilters,
}: FilterModalProps) => {
  const [localFilters, setLocalFilters] = useState<DataTableFilter[]>([]);

  // Initialize local filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters([...activeFilters]);
    }
  }, [isOpen, activeFilters]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFilterChange = (
    key: string,
    value: any,
    type:
      | "text"
      | "select"
      | "date"
      | "dateRange"
      | "number"
      | "numberRange"
      | "boolean"
  ) => {
    const newFilters = localFilters.filter((f) => f.key !== key);
    if (value !== null && value !== undefined && value !== "") {
      newFilters.push({ key, value, type });
    }
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    setLocalFilters([]);
    onClearFilters();
    onClose();
  };

  const filterableColumns = columns.filter((col) => col.filterable);

  // Check if a date filter is active
  const isDateFilterActive = (filterType: string) => {
    const dateFilter = localFilters.find((f) => f.key === "date");
    if (!dateFilter) return false;

    const today = new Date().toISOString().split("T")[0];

    switch (filterType) {
      case "today":
        return dateFilter.value === today;

      case "week": {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        const weekRange = `${startOfWeek.toISOString().split("T")[0]} to ${
          endOfWeek.toISOString().split("T")[0]
        }`;
        return dateFilter.value === weekRange;
      }

      case "month": {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const endOfMonth = new Date(
          startOfMonth.getFullYear(),
          startOfMonth.getMonth() + 1,
          0
        );
        const monthRange = `${startOfMonth.toISOString().split("T")[0]} to ${
          endOfMonth.toISOString().split("T")[0]
        }`;
        return dateFilter.value === monthRange;
      }

      case "year": {
        const startOfYear = new Date();
        startOfYear.setMonth(0, 1);
        const endOfYear = new Date(startOfYear.getFullYear(), 11, 31);
        const yearRange = `${startOfYear.toISOString().split("T")[0]} to ${
          endOfYear.toISOString().split("T")[0]
        }`;
        return dateFilter.value === yearRange;
      }

      default:
        return false;
    }
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="relative w-full max-w-sm h-full bg-white shadow-xl border-l animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">
                Filter Data
              </h2>
            </div>
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              size="sm"
              fullWidth={false}
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          </div>

          {/* Filter Content - Full Height with Scroll */}
          <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {filterableColumns.map((col) => (
                  <FilterInput
                    key={col.key}
                    column={col}
                    value={localFilters.find((f) => f.key === col.key)?.value}
                    onChange={(value) =>
                      handleFilterChange(
                        col.key,
                        value,
                        col.filterType || "text"
                      )
                    }
                  />
                ))}
              </div>

              {/* Instant Date Filter Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-xs font-medium text-gray-700 mb-3">
                  Quick Date Filters
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      const today = new Date().toISOString().split("T")[0];
                      handleFilterChange("date", today, "date");
                    }}
                    fullWidth
                    variant={isDateFilterActive("today") ? "primary" : "secondary"}
                    className="text-xs"
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      const startOfWeek = new Date();
                      startOfWeek.setDate(
                        startOfWeek.getDate() - startOfWeek.getDay()
                      );
                      const endOfWeek = new Date(startOfWeek);
                      endOfWeek.setDate(endOfWeek.getDate() + 6);
                      handleFilterChange(
                        "date",
                        `${startOfWeek.toISOString().split("T")[0]} to ${
                          endOfWeek.toISOString().split("T")[0]
                        }`,
                        "dateRange"
                      );
                    }}
                    fullWidth
                    variant={isDateFilterActive("week") ? "primary" : "secondary"}
                    className="text-xs"
                  >
                    This Week
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      const startOfMonth = new Date();
                      startOfMonth.setDate(1);
                      const endOfMonth = new Date(
                        startOfMonth.getFullYear(),
                        startOfMonth.getMonth() + 1,
                        0
                      );
                      handleFilterChange(
                        "date",
                        `${startOfMonth.toISOString().split("T")[0]} to ${
                          endOfMonth.toISOString().split("T")[0]
                        }`,
                        "dateRange"
                      );
                    }}
                    fullWidth
                    variant={isDateFilterActive("month") ? "primary" : "secondary"}
                    className="text-xs"
                  >
                    This Month
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      const startOfYear = new Date();
                      startOfYear.setMonth(0, 1);
                      const endOfYear = new Date(
                        startOfYear.getFullYear(),
                        11,
                        31
                      );
                      handleFilterChange(
                        "date",
                        `${startOfYear.toISOString().split("T")[0]} to ${
                          endOfYear.toISOString().split("T")[0]
                        }`,
                        "dateRange"
                      );
                    }}
                    fullWidth
                    variant={isDateFilterActive("year") ? "primary" : "secondary"}
                    className="text-xs"
                  >
                    This Year
                  </Button>
                </div>
              </div>

              {filterableColumns.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Filter className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No filterable columns available</p>
                </div>
              )}
            </div>

            {/* Footer - Fixed at Bottom */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-600">
                  {localFilters.length} filter(s) applied
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Button
                  type="button"
                  onClick={handleApplyFilters}
                  variant="secondary"
                  className="text-xs"
                >
                  Apply Filters
                </Button>
                <div className="flex gap-1.5">
                  <Button
                    type="button"
                    onClick={handleClearFilters}
                    variant="secondary"
                    className="flex-1 text-xs"
                  >
                    Clear All
                  </Button>
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="secondary"
                    className="flex-1 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

// Filter Input Component
const FilterInput = ({
  column,
  value,
  onChange,
}: {
  column: DataTableColumn;
  value: any;
  onChange: (value: any) => void;
}) => {
  const inputClasses =
    "w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors";

  switch (column.filterType) {
    case "select":
      return (
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">
            {column.title}
          </label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          >
            <option value="">
              {column.filterPlaceholder || `Select ${column.title}`}
            </option>
            {(column.filterOptions || []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "date":
      return (
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">
            {column.title}
          </label>
          <input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          />
        </div>
      );
    case "number":
      return (
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">
            {column.title}
          </label>
          <input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={column.filterPlaceholder || `Enter ${column.title}`}
            className={inputClasses}
          />
        </div>
      );
    default:
      return (
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">
            {column.title}
          </label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={column.filterPlaceholder || `Search ${column.title}`}
            className={inputClasses}
          />
        </div>
      );
  }
};

export default FilterModal;
