/**
 * Route Configuration
 * Centralized route paths for easy maintenance
 */

export const ROUTES = {
  // Auth Routes
  AUTH: {
    ROOT: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY: '/verify',
    CREATE_PIN: '/create-pin',
  },

  // Onboarding Routes
  ONBOARDING: {
    ACCOUNT_TYPE: '/auth',
    SCHOOL_TYPE: '/school-type',
    SCHOOL_SELECTION: '/school-selection',
    PORTAL_MEMBERSHIP: '/portal-membership',
    PORTAL_IDENTIFICATION: '/portal-identification',
    ADMIN_OTP: '/admin-otp',
    ADMIN_VERIFICATION: '/admin-verification',
    PHONE_VERIFICATION: '/phone-verification',
    TERMS: '/terms',
    SET_PIN: '/set-pass-pin',
    FORGET_PIN: '/forget-pin',
    RESET_PIN: '/reset-pin',
  },

  // Dashboard Routes
  DASHBOARD: {
    HOME: '/dashboard',
    STATISTICS: '/dashboard/statistics',
    PROFILE: '/dashboard/profile',
    
    // Students Hub
    STUDENTS: '/dashboard/students',
    STUDENTS_HUB: '/dashboard/student-hub',
    CLASSES: '/dashboard/classes',
    SUB_CLASS: '/dashboard/sub-class',
    
    // Transactions
    TRANSACTIONS: '/dashboard/transactions',
    INVOICE: '/dashboard/invoice',
    TRANSFERS: '/dashboard/transfers',
    SETTLEMENTS: '/dashboard/settlements',
    SETTLEMENT: '/dashboard/settlement',
    PAYMENT_ACTIVITY: '/dashboard/payment-activity',
    WALLET: '/dashboard/wallet',
    
    // Users
    PARENTS: '/dashboard/parents',
    ADMIN_ACCOUNTS: '/dashboard/admin-accounts',
    
    // Results Manager
    RESULTS_MANAGER: '/dashboard/results-manager',
    EXAMS: '/dashboard/results-manager/exams',
    COURSES: '/dashboard/results-manager/courses',
    SUBJECTS: '/dashboard/results-manager/subjects',
    RESULTS: '/dashboard/results-manager/results',
    STUDENT_REPORT: '/dashboard/results-manager/student-report',
    CLASS_RESULTS: '/dashboard/results-manager/class-results',
  },
} as const;

