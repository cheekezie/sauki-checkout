import type { ReactNode } from 'react';
import type { MerchantI } from './organization.interface';
import type { User } from './user.interface';
import type { Toast } from './ui.interface';

export interface StartLoginResI {
  tempToken?: string;
  token?: string;
  orgs?: MerchantI[];
  user?: User;
  data?: StartLoginResI;
  status?: string;
}

export interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

export interface ToastProviderProps {
  children: ReactNode;
}

// Auth State
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  schools: MerchantI[];
  selectedSchool: MerchantI | null;
  tempToken: string | null;
  error: string | null;
}

// Auth Context
export interface AuthContextType {
  state: AuthState;
  login: (phoneNumber: string, password: string) => Promise<void>;
  selectSchool: (schoolId: string) => Promise<void>;
  switchOrganization: (orgId: string) => Promise<{ success: boolean; selectedSchool: MerchantI | null }>;
  logout: () => Promise<void>;
  clearError: () => void;
  registerSchool: (data: any) => Promise<void>;
  verifyEmail: (email: string) => Promise<{ success: boolean }>;
  forgotPassword: (email: string) => Promise<{ success: boolean }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean }>;
  sendAdminOTP: (phoneNumber: string, pin: string) => Promise<any>;
  verifyAdminOTP: (phoneNumber: string, confirmCode: string) => Promise<any>;
  verifyPortalId: (portalId: string) => Promise<any>;
  verifyPhone: (phoneNumber: string, otp: string) => Promise<any>;
  resendPhoneOTP: (phoneNumber: string) => Promise<any>;
  setPassPin: (phoneNumber: string, pin: string) => Promise<any>;
  forgetPin: (phoneNumber: string) => Promise<any>;
  resetPin: (phoneNumber: string, resetCode: string, newPin: string) => Promise<{ success: boolean; data?: any }>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
