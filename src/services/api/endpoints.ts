// Authentication & Admin Endpoints
export const AuthEndpoints = {
  loginStepOne: '/api/v2/admin/login-temp',
  loginStepTwo: '/api/v2/admin/login',
  sendAdminOTP: '/api/v2/admin/login-temp',
  verifyAdminOTP: '/api/v2/admin/verify',
  verifyEmail: '/api/v2/admin/verify-email',
  verifyPhone: '/api/v2/admin/verify',
  verifyPortalId: '/api/v2/admin/verify-portal',
  resendPhoneOTP: '/api/v2/admin/resend-otp',
  
  forgotPassword: '/api/v2/admin/forgot-password',
  resetPassword: '/api/v2/admin/reset-password',
  
  setPassPin: '/api/v2/admin/pass-pin',
  forgetPin: '/api/v2/admin/forget-pin',
  resetPin: '/api/v2/admin/reset-pin',
  
  logout: '/api/v2/admin/logout',
  switchOrganization: '/api/v2/admin/switch-acc',
  
  createAdmin: '/api/v2/admin/create',
  getAdmins: '/api/v2/admin/all',
  addAdminToOrg: '/api/v2/admin/add-admin-org',
  assignOrgToMasterAccount: (orgId: string) => `/api/v2/admin/assign-org-to-master-account/${orgId}`,
  updateAdmin: (id: string) => `/api/v2/admin/edit/${id}`,
  deleteAdmin: (id: string) => `/api/v2/admin/delete/${id}`,
};

// Organization Endpoints
export const OrganizationEndpoints = {
  registerSchool: '/api/v2/org/registration',
  registerOrganizationFromDashboard: '/api/v2/org/registration-dash',
  
  getAllOrganizations: '/api/v2/org/all',
  getOrganizationProfile: '/api/v2/org/profile',
  getDashboard: '/api/v2/org/dashboard',
  
  updateOrganization: (id: string) => `/api/v2/org/admin/edit/${id}`,
  updateOrganizationProfile: '/api/v2/org/edit',
  activateOrganization: '/api/v2/org/activate',
  addBankDetails: '/api/v2/org/bank',
  updateKycDocuments: '/api/v2/org/kyc',
  deleteOrganization: (id: string) => `/api/v2/org/delete/${id}`,
  
  getActivity: '/api/v2/org/activity',
  
  getAllSessions: '/api/v2/session/all',
  startSession: (id: string) => `/api/v2/session/start/${id}`,
};

// Student Endpoints
export const StudentEndpoints = {
  getStudentsNew: (format: 'json' | 'file-export' = 'json') => `/api/v2/student/all-students-new/${format}`,
  getStudents: '/api/v2/student/all',
  getStudentById: (id: string) => `/api/v2/student/${id}`,
  createStudent: '/api/v2/student/create',
  updateStudent: (id: string) => `/api/v2/student/edit/${id}`,
  deleteStudent: (id: string) => `/api/v2/student/delete/${id}`,
  changeClass: '/api/v2/student/change-class',
  undoGraduation: '/api/v2/student/undo-graduation',
  searchStudents: '/api/v2/student/search',
};

// Class Endpoints
export const ClassEndpoints = {
  getAllClasses: '/api/v2/class/all',
  updateClass: (id: string) => `/api/v2/class/edit/${id}`,
  
  createSubClass: '/api/v2/class/subclass/create',
  getAllSubClasses: '/api/v2/class/all-subclass',
  getAssignedSubClasses: (classId: string) => `/api/v2/class/assigned-subclass/${classId}`,
  updateSubClass: (id: string) => `/api/v2/class/subclass/edit/${id}`,
  assignSubClass: '/api/v2/class/subclass/assign',
  unassignSubClass: '/api/v2/class/subclass/unassign',
  deleteSubClass: (id: string) => `/api/v2/class/subclass/delete/${id}`,
};

// Payment Endpoints
export const PaymentEndpoints = {
  getPaymentGateways: '/api/v2/payment/payment-gateways',
  simulateTransfer: '/api/v2/payment/simulate-transfer',
  getTransfersNew: (format: 'json' | 'file-export' = 'json') => `/api/v2/payment/transfers-new/${format}`,
  getPricing: (organizationId?: string) => 
    organizationId 
      ? `/api/v2/payment/pricing?organization=${organizationId}`
      : '/api/v2/payment/pricing',
  updatePricing: (organizationId?: string) => 
    organizationId 
      ? `/api/v2/payment/pricing?organization=${organizationId}`
      : '/api/v2/payment/pricing',
  getProfitSharingAccounts: '/api/v2/payment/profit-sharing-accounts',
  addProfitSharingAccount: '/api/v2/payment/profit-sharing-accounts',
  updateProfitSharingAccount: (id: string) => `/api/v2/payment/profit-sharing-accounts/${id}`,
  deleteProfitSharingAccount: (id: string) => `/api/v2/payment/profit-sharing-accounts/${id}`,
};

// Config Endpoints
export const ConfigEndpoints = {
  fileUpload: '/api/v2/config/file-upload',
  convertCsv: '/api/v2/config/convert-csv',
  getEnums: '/api/v2/config/enums',
  getDomain: '/api/v2/config/domain',
  verifyAccount: '/api/v2/config/verify-account',
  getBankList: '/api/v2/config/bank-list',
};

// Merchant Endpoints
export const MerchantEndpoints = {
  getMyProfile: '/api/v2/merchant/me',
  getMyPermissions: '/api/v2/merchant/permissions',
};

// Transaction Endpoints
export const TransactionEndpoints = {
  getTransactions: '/api/v2/transactions',
  createTransaction: '/api/v2/transactions',
  getInvoices: '/api/v2/invoices',
  createInvoice: '/api/v2/invoices',
  getTransfers: '/api/v2/transfers',
  createTransfer: '/api/v2/transfers',
  getSettlements: '/api/v2/settlements',
  createSettlement: '/api/v2/settlements',
};

// User Management Endpoints
export const UserEndpoints = {
  getUsers: '/api/v2/users',
  createUser: '/api/v2/users',
  updateUser: '/api/v2/users',
  getRoles: '/api/v2/roles',
  createRole: '/api/v2/roles',
  getUserActivity: '/api/v2/user-activity',
};

// Analytics Endpoints
export const AnalyticsEndpoints = {
  getOverviewMetrics: '/api/v2/analytics/overview',
  getReports: '/api/v2/analytics/reports',
  getInsights: '/api/v2/analytics/insights',
};

// Legacy compatibility
export const AutheEndpoints = {
  loginStepOne: AuthEndpoints.loginStepOne,
  loginStepTwo: AuthEndpoints.loginStepTwo,
};
