import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

// Input Component
export interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'month';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  icon?: LucideIcon;
  maxLength?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  mask?: string;
  expiryDate?: boolean;
  allowedChars?: string[];
  inputClassName?: string;
}

// Textarea Component
export interface TextareaProps {
  label?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  rows?: number;
}

// Button Component
export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

// Checkbox Component
export interface CheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

// Select Component
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: readonly SelectOption[];
  placeholder?: string;
  icon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

// OTP Input Component
export interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onChange?: (otp: string) => void;
  value?: string;
  disabled?: boolean;
  className?: string;
}

// Toast Component
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

// Tooltip Component
export interface TooltipProps {
  label: string;
  children?: ReactNode;
  placement?: 'right' | 'left' | 'top' | 'bottom';
  delay?: number;
}

// Back Button Component
export interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

// Feature Card Component
export interface FeatureCardProps {
  heading: string;
  items: string[];
  className?: string;
  selectedType?: 'school' | 'other';
}

// Portal Component
export interface PortalProps {
  children: ReactNode;
}

// Modal Components
export type ModalType = 'email-sent' | 'pin-success' | 'verification-success' | 'confirmation' | 'info' | 'error';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
}

export interface ModalData {
  type: ModalType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export interface ModalContextType {
  showModal: (modal: ModalData) => void;
  hideModal: () => void;
  isModalOpen: boolean;
  currentModal: ModalData | null;
}

// Layout Components
export interface AuthLayoutProps {
  children: ReactNode;
  rightMaxWidth?: string;
  showBackAboveLogo?: boolean;
  showLogo?: boolean;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}

// DataTable Types
export type SortDirection = 'asc' | 'desc' | null;
export type FilterType = 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'numberRange' | 'boolean';
export type ColumnAlign = 'left' | 'center' | 'right';

export interface DataTableColumn<T = any> {
  key: string;
  title: string;
  description?: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: FilterType;
  filterOptions?: SelectOption[];
  filterPlaceholder?: string;
  render?: (value: any, row: T, index: number) => ReactNode;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: ColumnAlign;
  fixed?: 'left' | 'right';
  resizable?: boolean;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataTableFilter {
  key: string;
  value: any;
  type: FilterType;
}

export interface DataTableSort {
  key: string;
  direction: SortDirection;
}

export interface DataTablePagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
}

export interface DataTableSelection<T = any> {
  selectedRowKeys: string[];
  selectedRows: T[];
  onChange: (selectedRowKeys: string[], selectedRows: T[]) => void;
  getCheckboxProps?: (record: T) => { disabled?: boolean };
  type?: 'checkbox' | 'radio';
}

export interface DataTableAction<T = any> {
  key: string;
  title: string;
  icon?: LucideIcon;
  onClick: (row: T, index: number) => void;
  disabled?: (row: T) => boolean;
  show?: (row: T) => boolean;
  className?: string;
  confirm?: {
    title: string;
    message: string;
  };
}

export interface DataTableProps<T = any> {
  // Data
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  error?: string;

  // Row Configuration
  rowKey?: string | ((record: T) => string);
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  rowClassName?: (record: T, index: number) => string;

  // Selection
  selection?: DataTableSelection<T>;
  selectionColumnWidth?: string | number;

  // Actions
  actions?: DataTableAction<T>[];
  actionColumnTitle?: string;
  actionColumnWidth?: string | number;

  // Sorting
  sortable?: boolean;
  defaultSort?: DataTableSort;
  onSortChange?: (sort: DataTableSort) => void;

  // Filtering
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: string[];
  filters?: DataTableFilter[];
  onFilterChange?: (filters: DataTableFilter[]) => void;

  // Pagination
  pagination?: DataTablePagination | false;
  onPageChange?: (page: number, pageSize: number) => void;

  // Export
  exportable?: boolean;
  exportFileName?: string;
  onExport?: (data: T[], format: 'csv' | 'excel') => void;

  // Column Management
  columnManagement?: boolean;
  onColumnChange?: (columns: DataTableColumn<T>[]) => void;

  // Virtual Scrolling
  virtualScrolling?: boolean;
  virtualScrollingHeight?: number;

  // Styling
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  size?: 'small' | 'medium' | 'large';
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;

  // Empty State
  emptyText?: string;
  emptyIcon?: LucideIcon;

  // Loading State
  loadingText?: string;

  // Responsive
  responsive?: boolean;
  scroll?: {
    x?: number | string;
    y?: number | string;
  };
}
