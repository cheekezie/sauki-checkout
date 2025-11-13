import DataTable from "../components/ui/DataTable";
import type { DataTableColumn } from "../interface/ui.interface";
import { formatTableDate } from "@/utils/tableFormatters";

// Example 1: Simple Student List
interface StudentData extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  grade: string;
  enrollmentDate: string;
}

const studentData: StudentData[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@school.com",
    grade: "A",
    enrollmentDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@school.com",
    grade: "B",
    enrollmentDate: "2024-01-20",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@school.com",
    grade: "A+",
    enrollmentDate: "2024-02-01",
  },
];

const studentColumns: DataTableColumn<StudentData>[] = [
  {
    key: "name",
    title: "Name",
    sortable: true,
    filterable: true,
    filterType: "text",
  },
  {
    key: "email",
    title: "Email",
    sortable: true,
    filterable: true,
    filterType: "text",
  },
  {
    key: "grade",
    title: "Grade",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: [
      { value: "A+", label: "A+" },
      { value: "A", label: "A" },
      { value: "B", label: "B" },
    ],
  },
  {
    key: "enrollmentDate",
    title: "Enrolled",
    sortable: true,
    filterable: true,
    filterType: "date",
    render: (value) => formatTableDate(value),
  },
];

// Example 2: Fee Collection Summary
interface FeeData extends Record<string, unknown> {
  id: string;
  feeType: string;
  totalAmount: string;
  collectedAmount: string;
  pendingAmount: string;
  collectionRate: string;
}

const feeData: FeeData[] = [
  {
    id: "1",
    feeType: "Tuition",
    totalAmount: "₦500,000",
    collectedAmount: "₦450,000",
    pendingAmount: "₦50,000",
    collectionRate: "90%",
  },
  {
    id: "2",
    feeType: "Hostel",
    totalAmount: "₦200,000",
    collectedAmount: "₦180,000",
    pendingAmount: "₦20,000",
    collectionRate: "90%",
  },
  {
    id: "3",
    feeType: "Library",
    totalAmount: "₦50,000",
    collectedAmount: "₦40,000",
    pendingAmount: "₦10,000",
    collectionRate: "80%",
  },
];

const feeColumns: DataTableColumn<FeeData>[] = [
  {
    key: "feeType",
    title: "Fee Type",
    sortable: true,
    filterable: true,
    filterType: "text",
  },
  { key: "totalAmount", title: "Total Amount", sortable: true, align: "right" },
  {
    key: "collectedAmount",
    title: "Collected",
    sortable: true,
    align: "right",
  },
  { key: "pendingAmount", title: "Pending", sortable: true, align: "right" },
  { key: "collectionRate", title: "Rate", sortable: true, align: "center" },
];

// Example 3: Minimal Configuration (No filters, just display)
interface SimpleData extends Record<string, unknown> {
  id: string;
  item: string;
  value: number;
}

const simpleData: SimpleData[] = [
  { id: "1", item: "Item 1", value: 100 },
  { id: "2", item: "Item 2", value: 200 },
  { id: "3", item: "Item 3", value: 300 },
];

const simpleColumns: DataTableColumn<SimpleData>[] = [
  { key: "item", title: "Item", sortable: true },
  { key: "value", title: "Value", sortable: true, align: "right" },
];

const DataTableExamples = () => {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">DataTable Reusability Examples</h1>

      {/* Example 1: Student List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Example 1: Student List</h2>
        <DataTable
          data={studentData}
          columns={studentColumns}
          searchable
          exportable
          pagination={{ current: 1, pageSize: 10, total: studentData.length }}
        />
      </div>

      {/* Example 2: Fee Collection */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Example 2: Fee Collection Summary
        </h2>
        <DataTable
          data={feeData}
          columns={feeColumns}
          searchable
          exportable
          pagination={{ current: 1, pageSize: 10, total: feeData.length }}
          striped
          hoverable
        />
      </div>

      {/* Example 3: Simple Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Example 3: Simple Table (No Filters)
        </h2>
        <DataTable
          data={simpleData}
          columns={simpleColumns}
          pagination={false}
          bordered={false}
        />
      </div>
    </div>
  );
};

export default DataTableExamples;
