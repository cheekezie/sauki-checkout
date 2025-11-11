import { DollarSign, ArrowUpRight, ChevronRight } from "lucide-react";
import type { IncomingTraffic } from "../../services/dashboard.service";
import { formatCurrency } from "../../utils/formatCurrency";

interface PotentialItemProps {
  title: string;
  subtitle?: string;
}

const PotentialItem = ({ title, subtitle }: PotentialItemProps) => {
  return (
    <div className="bg-offwhite/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-text mb-1">{title}</h4>
          {subtitle && <p className="text-xs text-dark">{subtitle}</p>}
        </div>
        <button className="w-8 h-8 rounded-full bg-offwhite/50 text-dark hover:text-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface PotentialListProps {
  incomingTraffic?: IncomingTraffic[];
}

const PotentialList = ({ incomingTraffic = [] }: PotentialListProps) => {
  const potentialData = incomingTraffic.map((traffic) => ({
    title: traffic.fee,
    subtitle: `${formatCurrency(traffic.total)} Total`,
  }));

  return (
    <div className="bg-bg/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm font-sora">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-dark" />
          <h2 className="text-xl font-semibold text-text">
            School Potential List
          </h2>
        </div>
        <button className="w-10 h-10 rounded-full bg-primary/10 text-dark hover:text-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center">
          <div className="w-5 h-5 flex flex-col items-center justify-center space-y-1">
            <div className="w-1 h-1 bg-dark rounded-full"></div>
            <div className="w-1 h-1 bg-dark rounded-full"></div>
            <div className="w-1 h-1 bg-dark rounded-full"></div>
          </div>
        </button>
      </div>

      {/* Potential Items */}
      <div className="space-y-3 mb-6">
        {potentialData.map((item, index) => (
          <PotentialItem key={index} {...item} />
        ))}
      </div>

      {/* See More Button */}
      <div className="border-t border-offwhite/30 pt-4">
        <button
          onClick={() => (window.location.href = "/dashboard/statistics")}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary font-medium rounded-xl transition-all duration-200 group"
        >
          <span>View All Potentials</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};

export default PotentialList;
