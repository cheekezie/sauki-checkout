export interface ApiDataResI<T = any> {
  status: string;
  message: string;
  responseCode: number;
  code: number;
  data: T;
}

export interface ApiResponse<T = any> {
  status: string;
  data: T;
}

export interface LoginResponse {
  status: string;
  data: {
    token?: string;
    user?: any;
    schools?: any[];
  };
}

export interface School {
  _id: string;
  organizationName: string;
  serialNum: string;
  email: string;
  phoneNumber: string;
  organizationCategory: 'school' | 'other';
  schoolType: 'primary' | 'secondary' | 'tertiary';
  disabled: boolean;
}