/**
 * Application Constants
 * Centralized configuration values
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_KEY = import.meta.env.VITE_API_KEY;
export const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || 'info';

// Cookie Configuration
export const COOKIE_EXPIRY_DAYS = 14;

// Pagination
export const PAGINATION_DEFAULT_SIZE = 10;
export const PAGINATION_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// LocalStorage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  ACTIVE_ORG_ID: 'active_org_id',
  USER_PREFERENCES: 'user_preferences',
} as const;

// Cookie Names
export const COOKIE_NAMES = {
  STUDENTS_LIST: '_students_list',
  BUSINESS_CONFIG: '_businessConfig',
  MERCHANT: '_merchant',
  PROFILE: '_profile',
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'SaukiPay',
  VERSION: '1.0.0',
  DEFAULT_LOCALE: 'en-US',
} as const;

