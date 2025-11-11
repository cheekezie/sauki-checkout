import { useState, useMemo } from "react";
import { MoreVertical, Play } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import type { DataTableColumn } from "@/interface/ui.interface";
import { useSessions, useStartSession } from "@/hooks/useSessions";
import { ComponentLoading } from "@/components/ui/LoadingSpinner";
import SmartDropdown from "@/components/ui/SmartDropdown";
import { useToast } from "@/hooks/useToast";
import type { Session } from "@/interface/session.interface";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

interface SessionData {
  sn: number;
  _id: string;
  year: string;
  term: string;
  status: "active" | "inactive" | "completed";
}

type SessionTableRow = SessionData & Record<string, unknown>;

const Sessions = () => {
  const { data, isLoading, refetch } = useSessions();
  const startSessionMutation = useStartSession();
  const { showSuccess, showError } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sessions: Session[] = data?.data || [];

  // Transform data for table with S/N (with pagination)
  const tableData: SessionTableRow[] = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sessions.slice(start, start + pageSize).map((session, index) => ({
      sn: start + index + 1,
      _id: session._id,
      year: session.year || "—",
      term: session.term || "—",
      status: (session.status as SessionTableRow["status"]) || "inactive",
    }));
  }, [sessions, currentPage, pageSize]);

  const formatTerm = (term: string) => {
    if (!term) return "—";
    const termMap: Record<string, string> = {
      firstTerm: "First Term",
      secondTerm: "Second Term",
      thirdTerm: "Third Term",
    };
    return termMap[term] || term;
  };

  const formatStatus = (status: SessionTableRow["status"]) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Active
        </span>
      );
    }
    if (status === "completed") {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
        Inactive
      </span>
    );
  };

  const handleStartSession = async (sessionId: string) => {
    try {
      await startSessionMutation.mutateAsync(sessionId);
      showSuccess("Session Started", "The selected session is now active.");
      await refetch();
    } catch (error) {
      showError("Failed", "Unable to start the session. Please try again.");
    }
  };

  const DropdownAction = ({ session }: { session: SessionTableRow }) => {
    const options = [] as Array<{
      label: string;
      icon: typeof Play;
      onClick: () => void;
      disabled?: boolean;
    }>;

    if (session.status === "inactive") {
      options.push({
        label: "Start Session",
        icon: Play,
        onClick: () => handleStartSession(session._id),
        disabled: startSessionMutation.isPending,
      });
    }

    if (options.length === 0) {
      return null;
    }

    return (
      <SmartDropdown
        trigger={
          <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>
        }
        options={options}
      />
    );
  };

  const columns: DataTableColumn<SessionTableRow>[] = useMemo(
    () => [
      {
        key: "sn",
        title: "S/N",
        sortable: true,
        width: "80px",
        align: "left",
      },
      {
        key: "year",
        title: "Year",
        sortable: true,
        width: "200px",
        align: "left",
      },
      {
        key: "term",
        title: "Term",
        sortable: true,
        width: "200px",
        align: "left",
        render: (_value, row: SessionTableRow) => formatTerm(row.term),
      },
      {
        key: "status",
        title: "Status",
        sortable: true,
        width: "150px",
        align: "left",
        render: (_value, row: SessionTableRow) => formatStatus(row.status),
      },
      {
        key: "actions",
        title: "",
        width: "80px",
        align: "center" as const,
        render: (_value, row: SessionTableRow) => <DropdownAction session={row} />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <DashboardPageLayout
      title="Sessions"
      description="Monitor academic session lifecycle"
    >
      <>
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <ComponentLoading size="lg" />
          </div>
        ) : (
          <DataTable<SessionTableRow>
            data={tableData}
            columns={columns}
            actions={[]}
            loading={isLoading || startSessionMutation.isPending}
            searchable
            searchPlaceholder="Search by year or term..."
            searchFields={["year", "term"]}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: sessions.length,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50],
              showQuickJumper: true,
              showTotal: (total: number, range: [number, number]) =>
                `Showing ${range[0]}-${range[1]} of ${total} sessions`,
            }}
            onPageChange={(page: number, newPageSize: number) => {
              setCurrentPage(page);
              if (newPageSize !== pageSize) {
                setPageSize(newPageSize);
                setCurrentPage(1);
              }
            }}
            striped
            hoverable
            bordered={false}
            size="small"
            emptyText="No sessions found"
            loadingText="Loading sessions..."
            className="text-xs"
            columnManagement
            exportable
            exportFileName="sessions"
          />
        )}
      </>
    </DashboardPageLayout>
  );
};

export default Sessions;

