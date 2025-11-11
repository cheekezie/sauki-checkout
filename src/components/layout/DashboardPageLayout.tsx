import type { ReactNode } from "react";

export interface DashboardPageStat {
  label: string;
  value: ReactNode;
  helperText?: ReactNode;
  valueClassName?: string;
  icon?: ReactNode;
}

interface DashboardPageLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  stats?: DashboardPageStat[];
  children: ReactNode;
  className?: string;
  statsClassName?: string;
}

const DashboardPageLayout = ({
  title,
  description,
  actions,
  stats,
  children,
  className,
  statsClassName,
}: DashboardPageLayoutProps) => {
  return (
    <div className={`space-y-6 ${className ?? ""}`.trim()}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-text">{title}</h1>
            {description ? (
              <p className="text-gray-600">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-3">{actions}</div>
          ) : null}
        </div>

        {stats?.length ? (
          <div
            className={`flex flex-col gap-4 sm:flex-row sm:flex-wrap ${statsClassName ?? ""}`.trim()}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex min-w-[180px] flex-1 items-center gap-3 rounded-lg border border-gray-200 bg-white p-4"
              >
                {stat.icon ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {stat.icon}
                  </div>
                ) : null}
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div
                    className={`text-2xl font-bold text-gray-900 ${stat.valueClassName ?? ""}`.trim()}
                  >
                    {stat.value}
                  </div>
                  {stat.helperText ? (
                    <div className="text-xs text-gray-500">{stat.helperText}</div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {children}
    </div>
  );
};

export default DashboardPageLayout;

