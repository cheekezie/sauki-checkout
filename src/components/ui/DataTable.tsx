import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  Search,
  Filter,
  Download,
  ChevronUp,
  ChevronDown,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FilterModal from "./FilterModal";
import { Portal } from "../layout/Portal";
import Button from "./Button";
import Input from "./Input";
import type {
  DataTableProps,
  DataTableColumn,
  DataTableFilter,
  DataTableSort,
} from "../../interface/ui.interface";
import { useConfirmModal } from "@/hooks/useConfirmModal";

const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  error,
  rowKey = "id",
  onRowClick,
  onRowDoubleClick,
  rowClassName,
  selection,
  selectionColumnWidth = 80,
  actions = [],
  actionColumnTitle = "Actions",
  actionColumnWidth = 120,
  defaultSort,
  onSortChange,
  searchable = true,
  searchPlaceholder = "Search...",
  searchFields,
  filters = [],
  onFilterChange,
  pagination = { current: 1, pageSize: 10, total: 0 },
  onPageChange,
  exportable = true,
  exportFileName = "data",
  onExport,
  columnManagement = true,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  size = "medium",
  striped = true,
  hoverable = true,
  emptyText = "No data available",
  emptyIcon: EmptyIcon,
  loadingText = "Loading...",
  responsive = true,
  scroll,
}: DataTableProps<T>) => {
  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<DataTableSort | null>(defaultSort || null);
  const [activeFilters, setActiveFilters] =
    useState<DataTableFilter[]>(filters);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const { confirm, ConfirmModal } = useConfirmModal();
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => col.key)
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const tableRef = useRef<HTMLDivElement>(null);

  // Get row key
  const getRowKey = useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === "function") {
        return rowKey(record);
      }
      const value = record[rowKey as keyof T];
      if (typeof value === "string") {
        return value;
      }
      if (value != null) {
        return String(value);
      }
      return index.toString();
    },
    [rowKey]
  );

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...data] as T[];

    // Global search
    if (searchTerm) {
      const searchFieldsToUse = searchFields || columns.map((col) => col.key);
      result = result.filter((record) =>
        searchFieldsToUse.some((field) => {
          const value = record[field as keyof T];
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
    }

    // Column filters
    activeFilters.forEach((filter) => {
      if (
        filter.value !== null &&
        filter.value !== undefined &&
        filter.value !== ""
      ) {
        result = result.filter((record) => {
          const value = record[filter.key as keyof T];
          switch (filter.type) {
            case "text": {
              if (value == null) {
                return false;
              }

              return value
                .toString()
                .toLowerCase()
                .includes(String(filter.value).toLowerCase());
            }
            case "select":
              return value === filter.value;
            case "number":
              return Number(value) === Number(filter.value);
            case "numberRange": {
              if (!Array.isArray(filter.value)) {
                return true;
              }
              const [min, max] = filter.value as [number, number];
              const numericValue = Number(value);
              return numericValue >= min && numericValue <= max;
            }
            case "date":
              return (
                new Date(value as string | number | Date).toDateString() ===
                new Date(filter.value).toDateString()
              );
            case "dateRange": {
              const recordDate = new Date(value as string | number | Date);

              if (Array.isArray(filter.value)) {
                const [start, end] = filter.value as [
                  Date | string,
                  Date | string
                ];
                const startDate = new Date(start);
                const endDate = new Date(end);
                return recordDate >= startDate && recordDate <= endDate;
              }

              if (typeof filter.value === "string") {
                const [start, end] = filter.value.split(" to ");
                if (start && end) {
                  const startDate = new Date(start);
                  const endDate = new Date(end);
                  return recordDate >= startDate && recordDate <= endDate;
                }
              }

              return true;
            }
            case "boolean":
              return Boolean(value) === Boolean(filter.value);
            default:
              return true;
          }
        });
      }
    });

    return result;
  }, [data, searchTerm, activeFilters, searchFields, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sort) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sort.key as keyof T];
      const bValue = b[sort.key as keyof T];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sort]);

  // Paginate data
  // Always do client-side pagination when pagination is provided
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    // Client-side pagination: slice the data
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  // Handle sorting
  const handleSort = useCallback(
    (columnKey: string) => {
      const column = columns.find((col) => col.key === columnKey);
      if (!column?.sortable) return;

      let newDirection: "asc" | "desc" | null = "asc";
      if (sort?.key === columnKey) {
        if (sort.direction === "asc") {
          newDirection = "desc";
        } else if (sort.direction === "desc") {
          newDirection = null;
        }
      }

      const newSort = newDirection
        ? { key: columnKey, direction: newDirection }
        : null;
      setSort(newSort);
      if (newSort) {
        onSortChange?.(newSort);
      }
    },
    [sort, columns, onSortChange]
  );

  // Handle row selection
  const handleRowSelection = useCallback(
    (rowKey: string, checked: boolean) => {
      let newSelectedRows: string[];
      if (checked) {
        newSelectedRows = [...selectedRows, rowKey];
      } else {
        newSelectedRows = selectedRows.filter((key) => key !== rowKey);
      }

      setSelectedRows(newSelectedRows);

      if (selection) {
        const selectedRecords = data.filter((record) =>
          newSelectedRows.includes(getRowKey(record, data.indexOf(record)))
        );
        selection.onChange(newSelectedRows, selectedRecords);
      }
    },
    [selectedRows, selection, data, getRowKey]
  );

  // Handle select all
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const allRowKeys = paginatedData.map((record, index) =>
        getRowKey(record, index)
      );
      setSelectedRows(checked ? allRowKeys : []);

      if (selection) {
        selection.onChange(
          checked ? allRowKeys : [],
          checked ? paginatedData : []
        );
      }
    },
    [paginatedData, selection, getRowKey]
  );

  // Generate CSV content
  const generateCsv = useCallback(
    (rows: T[], cols: DataTableColumn<T>[]): string => {
      const headers = cols.map((col) => col.title).join(",");
      const csvRows = rows.map((record) =>
        cols
          .map((col) => {
            const value = record[col.key as keyof T];
            return typeof value === "string"
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(",")
      );
      return [headers, ...csvRows].join("\n");
    },
    []
  );

  // Export data
  const handleExport = useCallback(
    (format: "csv" | "excel") => {
      if (onExport) {
        onExport(sortedData, format);
      } else {
        // Default CSV export
        const csvContent = generateCsv(sortedData, columns);
        downloadFile(csvContent, `${exportFileName}.csv`, "text/csv");
      }
    },
    [sortedData, columns, onExport, exportFileName, generateCsv]
  );

  // Download file
  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get visible columns
  const visibleColumnsData = useMemo(() => {
    return columns.filter((col) => visibleColumns.includes(col.key));
  }, [columns, visibleColumns]);

  // Size classes
  const sizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  const paddingClasses = {
    small: "px-3 py-2",
    medium: "px-4 py-3",
    large: "px-6 py-4",
  };

  if (error) {
    return (
      <>
        <div
          className={`bg-white rounded-lg border border-red-200 ${className}`}
        >
          <div className="flex items-center justify-center py-12 text-red-600">
            <X className="w-6 h-6 mr-2" />
            <span>{error}</span>
          </div>
        </div>
        <ConfirmModal />
      </>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-lg ${className}`}>
        {/* Header Controls */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex flex-col gap-3">
            {/* Top Row - Search and Action Buttons */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* Search Field - Full width on mobile, aligned left on desktop */}
              {searchable && (
                <Input
                  label=""
                  name="datatable-search"
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder={searchPlaceholder}
                  icon={Search}
                  className="w-full md:w-56 space-y-0 [&>label]:hidden"
                />
              )}

              {/* Action Buttons */}
              <div className="flex gap-1 flex-wrap">
                <Button
                  type="button"
                  onClick={() => setShowFilterModal(true)}
                  fullWidth={false}
                  variant={activeFilters.length > 0 ? "primary" : "secondary"}
                  className="flex items-center gap-1 text-xs"
                >
                  <Filter className="w-3 h-3" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilters.length > 0 && (
                    <span className="ml-1 bg-white text-primary rounded-full px-1 py-0.5 text-xs font-semibold">
                      {activeFilters.length}
                    </span>
                  )}
                </Button>

                {exportable && (
                  <Button
                    type="button"
                    onClick={() => handleExport("csv")}
                    fullWidth={false}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    <Download className="w-3 h-3" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                )}

                {columnManagement && (
                  <Button
                    type="button"
                    onClick={() => setShowColumnManager(!showColumnManager)}
                    fullWidth={false}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Results count */}
            <div className="text-xs text-gray-500">
              {sortedData.length} of {data.length} results
            </div>
          </div>

          {/* Column Manager - Desktop */}
          {showColumnManager && (
            <div className="hidden md:block mt-3 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-xs font-medium mb-2">Manage Columns</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {columns.map((col) => (
                  <label key={col.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setVisibleColumns([...visibleColumns, col.key]);
                        } else {
                          setVisibleColumns(
                            visibleColumns.filter((key) => key !== col.key)
                          );
                        }
                      }}
                      className="rounded border-gray-300 w-3 h-3"
                    />
                    <span className="text-xs">{col.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div
            ref={tableRef}
            className={`overflow-auto ${responsive ? "max-h-screen" : ""}`}
            style={scroll ? { maxHeight: scroll.y } : {}}
          >
            <table className="w-full">
              <thead className={`bg-gray-50 ${headerClassName}`}>
                <tr>
                  {/* Selection Column */}
                  {selection && (
                    <th
                      className={`${paddingClasses[size]} text-center`}
                      style={{ width: selectionColumnWidth }}
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.length === paginatedData.length &&
                          paginatedData.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </th>
                  )}

                  {/* Data Columns */}
                  {visibleColumnsData.map((col) => (
                    <th
                      key={col.key}
                      className={`
                    ${paddingClasses[size]} 
                    ${
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left"
                    }
                    ${col.sortable ? "cursor-pointer hover:bg-gray-100" : ""}
                    ${col.headerClassName || ""}
                  `}
                      onClick={() => col.sortable && handleSort(col.key)}
                      style={{
                        width: col.width,
                        minWidth: col.minWidth,
                        maxWidth: col.maxWidth,
                      }}
                    >
                      <div className="flex items-center relative w-full">
                        <span
                          className={`font-medium text-gray-900 ${sizeClasses[size]}`}
                        >
                          {col.title}
                        </span>
                        {col.sortable && (
                          <div className="flex flex-col ml-auto">
                            <ChevronUp
                              className={`w-3 h-3 ${
                                sort?.key === col.key &&
                                sort.direction === "asc"
                                  ? "text-primary"
                                  : "text-gray-400"
                              }`}
                            />
                            <ChevronDown
                              className={`w-3 h-3 -mt-1 ${
                                sort?.key === col.key &&
                                sort.direction === "desc"
                                  ? "text-primary"
                                  : "text-gray-400"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}

                  {/* Actions Column */}
                  {actions.length > 0 && (
                    <th
                      className={`${paddingClasses[size]} text-center`}
                      style={{ width: actionColumnWidth }}
                    >
                      <span
                        className={`font-medium text-gray-900 ${sizeClasses[size]}`}
                      >
                        {actionColumnTitle}
                      </span>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className={`divide-y divide-gray-200 ${bodyClassName}`}>
                {loading ? (
                  <tr>
                    <td
                      colSpan={
                        visibleColumnsData.length +
                        (selection ? 1 : 0) +
                        (actions.length > 0 ? 1 : 0)
                      }
                      className={`${paddingClasses[size]} text-center text-gray-500`}
                    >
                      <div className="flex flex-col items-center justify-center py-12 min-h-[200px]">
                        <span className="mb-4 text-gray-600">
                          {loadingText}
                        </span>
                        <div
                          className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"
                          role="status"
                          aria-label="Loading"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        visibleColumnsData.length +
                        (selection ? 1 : 0) +
                        (actions.length > 0 ? 1 : 0)
                      }
                      className={`${paddingClasses[size]} text-center text-gray-500`}
                    >
                      <div className="flex flex-col items-center py-8">
                        {EmptyIcon && (
                          <EmptyIcon className="w-12 h-12 text-gray-300 mb-4" />
                        )}
                        <span>{emptyText}</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((record, index) => {
                    const key = getRowKey(record, index);
                    const isSelected = selectedRows.includes(key);

                    return (
                      <tr
                        key={key}
                        className={`
                      ${hoverable ? "hover:bg-gray-50" : ""}
                      ${striped && index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      ${isSelected ? "bg-primary/5" : ""}
                      ${onRowClick ? "cursor-pointer" : ""}
                      ${rowClassName ? rowClassName(record, index) : ""}
                    `}
                        onClick={() => onRowClick?.(record, index)}
                        onDoubleClick={() => onRowDoubleClick?.(record, index)}
                      >
                        {/* Selection Cell */}
                        {selection && (
                          <td
                            className={`${paddingClasses[size]} text-center`}
                            style={{ width: selectionColumnWidth }}
                          >
                            <input
                              type={
                                selection.type === "radio"
                                  ? "radio"
                                  : "checkbox"
                              }
                              checked={isSelected}
                              onChange={(e) =>
                                handleRowSelection(key, e.target.checked)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="rounded border-gray-300"
                            />
                          </td>
                        )}

                        {/* Data Cells */}
                        {visibleColumnsData.map((col) => (
                          <td
                            key={col.key}
                            className={`
                          ${paddingClasses[size]}
                          ${
                            col.align === "center"
                              ? "text-center"
                              : col.align === "right"
                              ? "text-right"
                              : "text-left"
                          }
                          ${col.cellClassName || ""}
                          ${sizeClasses[size]}
                        `}
                          >
                            {col.render
                              ? col.render(
                                  record[col.key as keyof T],
                                  record,
                                  index
                                )
                              : (() => {
                                  const value = record[col.key as keyof T];
                                  // Handle objects - convert to string representation
                                  if (
                                    value &&
                                    typeof value === "object" &&
                                    !Array.isArray(value)
                                  ) {
                                    // If it's an object with a name property, use that
                                    if (
                                      "name" in value &&
                                      typeof value.name === "string"
                                    ) {
                                      return value.name;
                                    }
                                    // Otherwise, convert to string or show empty
                                    return String(value);
                                  }
                                  // Handle arrays
                                  if (Array.isArray(value)) {
                                    return value.length > 0
                                      ? String(value[0])
                                      : "";
                                  }
                                  // Handle primitives (string, number, boolean, null, undefined)
                                  return value == null ? "" : String(value);
                                })()}
                          </td>
                        ))}

                        {/* Actions Cell */}
                        {actions.length > 0 && (
                          <td className={`${paddingClasses[size]} text-center`}>
                            <div className="flex items-center justify-center space-x-1">
                              {actions.map((action) => (
                                <button
                                  key={action.key}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (action.confirm) {
                                      confirm({
                                        title: action.confirm.title,
                                        message: action.confirm.message,
                                        confirmText: "Confirm",
                                        cancelText: "Cancel",
                                        type: "warning",
                                        onConfirm: () =>
                                          action.onClick(record, index),
                                      });
                                    } else {
                                      action.onClick(record, index);
                                    }
                                  }}
                                  disabled={action.disabled?.(record)}
                                  className={`p-1.5 rounded-md text-gray-600 hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    action.className || ""
                                  }`}
                                  title={action.title}
                                >
                                  {action.icon ? (
                                    <action.icon className="w-4 h-4" />
                                  ) : (
                                    <span className="text-xs">
                                      {action.title}
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex flex-col items-center justify-center gap-2 min-h-[200px]">
                <span>{loadingText}</span>
                <div
                  className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"
                  role="status"
                  aria-label="Loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">{emptyText}</div>
          ) : (
            <div className="p-4 space-y-4">
              {paginatedData.map((record, index) => {
                const rowKey = getRowKey(record, index);
                const isSelected = selectedRows.includes(rowKey);

                return (
                  <div
                    key={rowKey}
                    className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${
                      isSelected ? "ring-2 ring-primary border-primary" : ""
                    } transition-all`}
                    onClick={() => onRowClick?.(record, index)}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      {selection && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelection(rowKey, e.target.checked);
                          }}
                          className="rounded border-gray-300 mt-1 w-4 h-4"
                        />
                      )}
                      {actions.length > 0 && (
                        <div className="flex items-center gap-2">
                          {actions.map((action) => (
                            <button
                              key={action.key}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(record, index);
                              }}
                              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md transition-colors"
                              title={action.title}
                            >
                              {action.icon && (
                                <action.icon className="w-4 h-4" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="space-y-2">
                      {visibleColumnsData.map((column) => (
                        <div
                          key={column.key}
                          className="flex justify-between items-center"
                        >
                          <span className="text-xs font-medium text-gray-600">
                            {column.title}:
                          </span>
                          <span className="text-xs text-gray-900 text-right max-w-[60%] truncate">
                            {column.render
                              ? column.render(
                                  record[column.key as keyof T],
                                  record,
                                  index
                                )
                              : (record[column.key as keyof T] as
                                  | string
                                  | number
                                  | boolean
                                  | null
                                  | undefined)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="px-3 py-3 border-t border-gray-200 bg-gray-50">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger={pagination.showSizeChanger}
              pageSizeOptions={pagination.pageSizeOptions}
              showQuickJumper={pagination.showQuickJumper}
              showTotal={pagination.showTotal}
              onChange={onPageChange}
            />
          </div>
        )}

        {/* Filter Modal */}
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          columns={visibleColumnsData}
          activeFilters={activeFilters}
          onApplyFilters={(filters) => {
            setActiveFilters(filters);
            onFilterChange?.(filters);
          }}
          onClearFilters={() => {
            setActiveFilters([]);
            onFilterChange?.([]);
          }}
        />

        {/* Column Management Modal - Mobile */}
        <ColumnManagerModal
          isOpen={showColumnManager}
          onClose={() => setShowColumnManager(false)}
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnsChange={setVisibleColumns}
        />
      </div>
      <ConfirmModal />
    </>
  );
};

// Column Manager Modal Component
const ColumnManagerModal = ({
  isOpen,
  onClose,
  columns,
  visibleColumns,
  onColumnsChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  columns: DataTableColumn[];
  visibleColumns: string[];
  onColumnsChange: (columns: string[]) => void;
}) => {
  const [localVisibleColumns, setLocalVisibleColumns] = useState<string[]>([]);

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalVisibleColumns([...visibleColumns]);
    }
  }, [isOpen, visibleColumns]);

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

  const handleColumnToggle = (columnKey: string, checked: boolean) => {
    if (checked) {
      setLocalVisibleColumns([...localVisibleColumns, columnKey]);
    } else {
      setLocalVisibleColumns(
        localVisibleColumns.filter((key) => key !== columnKey)
      );
    }
  };

  const handleApply = () => {
    onColumnsChange(localVisibleColumns);
    onClose();
  };

  const handleSelectAll = () => {
    setLocalVisibleColumns(columns.map((col) => col.key));
  };

  const handleSelectNone = () => {
    setLocalVisibleColumns([]);
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
              <Settings className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">
                Manage Columns
              </h2>
            </div>
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              fullWidth={false}
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="flex-1 overflow-y-auto p-4">
              {/* Quick Actions */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleSelectAll}
                    variant="secondary"
                    fullWidth={false}
                    className="px-3"
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSelectNone}
                    variant="secondary"
                    fullWidth={false}
                    className="px-3"
                  >
                    Select None
                  </Button>
                </div>
              </div>

              {/* Column List */}
              <div className="space-y-3">
                {columns.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={localVisibleColumns.includes(col.key)}
                      onChange={(e) =>
                        handleColumnToggle(col.key, e.target.checked)
                      }
                      className="rounded border-gray-300 w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        {col.title}
                      </span>
                      {col.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {col.description}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {columns.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No columns available</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-600">
                  {localVisibleColumns.length} of {columns.length} columns
                  selected
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Button
                  type="button"
                  onClick={handleApply}
                  variant="secondary"
                  className="text-sm"
                >
                  Apply Changes
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setLocalVisibleColumns([...visibleColumns]);
                    onClose();
                  }}
                  variant="secondary"
                  className="text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

// Pagination Component
const Pagination = ({
  current,
  pageSize,
  total,
  showSizeChanger = true,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = false,
  showTotal,
  onChange,
}: {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
  onChange?: (page: number, pageSize: number) => void;
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  const handlePageChange = (page: number) => {
    onChange?.(page, pageSize);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onChange?.(1, newPageSize);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push("...");
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col gap-3 px-2 py-2">
      {/* Results info */}
      <div className="text-xs text-gray-600 text-center">
        {showTotal
          ? showTotal(total, [startItem, endItem])
          : `Showing ${startItem} to ${endItem} of ${total} results`}
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Page size changer - Hidden on mobile */}
        {showSizeChanger && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-gray-600">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Page navigation */}
        <div className="flex items-center justify-center gap-1">
          <Button
            type="button"
            onClick={() => handlePageChange(current - 1)}
            disabled={current === 1}
            variant="secondary"
            fullWidth={false}
            className="inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {/* Mobile: Show only current page and total */}
          <div className="flex items-center gap-1 sm:hidden">
            <span className="text-xs text-gray-600">Page</span>
            <span className="text-sm font-medium text-gray-900">{current}</span>
            <span className="text-xs text-gray-600">of</span>
            <span className="text-sm font-medium text-gray-900">
              {totalPages}
            </span>
          </div>

          {/* Desktop: Show all page numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-1 text-gray-400 text-sm">...</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePageChange(page as number)}
                    className={`flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      page === current
                        ? "!bg-primary !text-white !border-black shadow-sm"
                        : "!text-primary !bg-white !border-gray-300 hover:!bg-gray-50 hover:!text-black hover:!border-black"
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <Button
            type="button"
            onClick={() => handlePageChange(current + 1)}
            disabled={current === totalPages}
            variant="secondary"
            fullWidth={false}
            className="inline-flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4" />
            Next
          </Button>
        </div>

        {/* Quick jumper - Hidden on mobile */}
        {showQuickJumper && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-gray-600">Go to:</span>
            <input
              type="number"
              placeholder="Page"
              min="1"
              max={totalPages}
              className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const page = Number((e.target as HTMLInputElement).value);
                  if (page >= 1 && page <= totalPages) {
                    handlePageChange(page);
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
