import { RequestService } from './api/client';
import { OrganizationEndpoints } from './api/endpoints';

export interface DashboardParams {
  start?: string; // Format: YYYY-MM-DD
  end?: string; // Format: YYYY-MM-DD
  trafficSession?: string; // Format: YYYY/YYYY
}

export interface ChartData {
  labels: string[];
  schoolFess: number[];
  otherFees: number[];
}

export interface IncomingTraffic {
  fee: string;
  total: number;
}

export interface LatestTransaction {
  payer: string;
  amount: number;
  dateConfirmed?: string;
  dateGenerated: string;
  status: string;
  fee: string;
  channel?: string;
  arrears?: boolean;
}

export interface LatestInvoice {
  payer: string;
  regNumber: string;
  amount: number;
  status: string;
  fee: string;
}

export interface DashboardData {
  totalReceive: number;
  totalStudents: number;
  totalFees: number;
  chartData: ChartData;
  incomingTraffic: IncomingTraffic[];
  latestTransactions: LatestTransaction[];
  latestInvoices: LatestInvoice[];
}

export interface DashboardResponse {
  status?: string;
  data?: DashboardData;
}

class DashboardService {
  /**
   * Get dashboard data
   * @param params - Query parameters for dashboard data
   * @returns Dashboard data
   */
  async getDashboard(params?: DashboardParams): Promise<DashboardResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.start) {
      queryParams.append('start', params.start);
    }
    if (params?.end) {
      queryParams.append('end', params.end);
    }
    if (params?.trafficSession) {
      queryParams.append('trafficSession', params.trafficSession);
    }

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${OrganizationEndpoints.getDashboard}?${queryString}`
      : OrganizationEndpoints.getDashboard;

    const response = await RequestService.get<DashboardResponse>(url);
    return response;
  }
}

export default new DashboardService();

