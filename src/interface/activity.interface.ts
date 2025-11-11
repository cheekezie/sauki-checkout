export interface Activity {
  _id: string;
  action: string;
  description: string;
  performedBy?: {
    _id: string;
    fullName?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    profileImage?: string;
  };
  user?: {
    _id: string;
    fullName?: string;
    name?: string;
    email?: string;
  };
  createdAt?: string;
  timestamp?: string;
  updatedAt?: string;
  deviceInfo?: {
    browser?: string;
    version?: string;
    os?: string;
    platform?: string;
    isDesktop?: string;
    isMobile?: string;
  };
  ipAddress?: string;
  userAgent?: string;
  os?: string;
  browser?: string;
  batchOperationCount?: number;
  organization?: string;
  metadata?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ActivityListResponse {
  status: string;
  data: {
    page: number;
    pages: number;
    activityCount: number;
    activity: Activity[];
  };
}

export interface GetActivityParams {
  pageNumber?: number;
  search?: string;
}

