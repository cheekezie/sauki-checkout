import axios from 'axios';
import encHex from 'crypto-js/enc-hex';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import { logger } from '../logger.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Global authentication error handler
type AuthErrorHandler = (errorMessage?: string) => void;
let globalAuthErrorHandler: AuthErrorHandler | null = null;
let isHandlingAuthError = false;

/**
 * Set the global authentication error handler
 * This will be called when a 401 error is detected
 * @param handler - Function that receives the error message from API
 */
export const setGlobalAuthErrorHandler = (handler: AuthErrorHandler) => {
  globalAuthErrorHandler = handler;
};

export const generateSignature = async (accountId: string) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_API_KEY is required for signature generation');
  }
  const timeStamp = Math.floor(Date.now() / 1000);
  const body = `${accountId}:${timeStamp}`;
  const macCipher = hmacSHA512(body, apiKey);
  const signature = macCipher.toString(encHex);
  return { signature, timeStamp };
};

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
    this.message = message;
  }
  get() {}
}

const getMessage = (message: any) => {
  if (typeof message === 'object') {
    const firstKey = Object.keys(message)[0];
    const firstValue = message[firstKey];
    return firstValue;
  }
  return message;
};

const _handleAxiosError = (err: any, endpoint?: string, method?: string) => {
  if (err.isAxiosError && err.response) {
    const { status, data } = err.response;

    // Log API error (legacy behaviour didn't log all errors)
    if (endpoint && method) {
      logger.apiError(endpoint, method, err);
    } else {
      logger.error('API request failed', err);
    }

    // Auth Error - Handle Logout (legacy return-first pattern, plus handler call)
    if (data.code === 401 || status === 401 || data.statusCode === 401) {
      const errorMessage =
        data.message ||
        data.error ||
        (typeof data.error === 'string' ? data.error : null) ||
        'Your session has expired. Please log in again.';

      if (globalAuthErrorHandler && !isHandlingAuthError) {
        isHandlingAuthError = true;
        try {
          globalAuthErrorHandler(errorMessage);
          setTimeout(() => {
            isHandlingAuthError = false;
          }, 2000);
        } catch (handlerError) {
          logger.error('Error in global auth error handler', handlerError);
          isHandlingAuthError = false;
        }
      }

      return {
        ...data,
        message: errorMessage,
        status: 'error',
        statusCode: 401,
        code: 401,
      };
    }

    if (data.message) {
      const responsMsg = getMessage(data.message);
      return { ...data, message: responsMsg };
    }

    if (!data.message && !data.message && !data?.error) {
      return { ...data, message: 'Unable to process request. Try again' };
    }

    if (data?.error && typeof data?.error === 'string') {
      return { ...data, message: data?.error };
    }

    const message =
      status === 500 || status === 503
        ? 'Unable to process request. Try again'
        : getMessage(data.message);
    return { ...data, message };
  }

  logger.error('Network or system error occurred', err);
  const fallbackMessage =
    typeof err?.message === 'string' && err.message.trim().length > 0
      ? err.message
      : 'A system error occurred';
  return {
    message: fallbackMessage,
    status: false,
    statusCode: 1000,
  };
};

export class RequestService {
  private static token: string | null = null;

  /**
   * Initialize token from localStorage
   */
  private static initializeToken() {
    if (RequestService.token === null) {
      RequestService.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * Set authentication token and persist to localStorage
   */
  static setToken(token: string | null) {
    RequestService.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Get current authentication token
   */
  static getToken() {
    RequestService.initializeToken();
    return RequestService.token;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    RequestService.initializeToken();
    return !!RequestService.token;
  }
  static constructQueryString = (params: { [key: string]: any }): string => {
    return Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  };

  static generateSignature = async (accountId: string) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_API_KEY is required for signature generation');
    }
    const timeStamp = Math.floor(Date.now() / 1000);
    const body = `${accountId}:${timeStamp}`;
    const macCipher = hmacSHA512(body, apiKey);
    const signature = macCipher.toString(encHex);
    return { signature, timeStamp };
  };

  static _getAuthHeaders = async (file?: 'file' | 'json') => {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': file === 'file' ? 'multipart/form-data' : 'application/json',
      };

      const token = RequestService.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Add organization context if available
      const activeOrgId = localStorage.getItem('active_org_id');
      if (activeOrgId) {
        headers['X-Organization-Id'] = activeOrgId;
        // Also try alternate header name if backend uses it
        headers['Organization-Id'] = activeOrgId;
      }

      return headers;
    } catch (e: any) {
      throw new Error('Could not get data from Async Storage');
    }
  };

  static async get<T>(url: string) {
    try {
      const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: await this._getAuthHeaders(),
      });
      const startTime = performance.now();
      const response = await axiosInstance.get<T>(url);
      const duration = performance.now() - startTime;
      logger.performance(`GET ${url}`, duration);
      return response.data;
    } catch (err: any) {
      throw _handleAxiosError(err, url, 'GET');
    }
  }

  static async post<T>(url: string, data: { [key: string]: any }) {
    try {
      const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: await this._getAuthHeaders(),
      });
      const startTime = performance.now();
      const response = await axiosInstance.post<T>(url, data);
      const duration = performance.now() - startTime;
      logger.performance(`POST ${url}`, duration);
      return response.data;
    } catch (err: any) {
      throw _handleAxiosError(err, url, 'POST');
    }
  }

  static async delete<T>(url: string, data: { [key: string]: any }) {
    try {
      const startTime = performance.now();
      const response = await axios.delete<T>(API_BASE_URL + url, {
        headers: await this._getAuthHeaders(),
        data,
      });
      const duration = performance.now() - startTime;
      logger.performance(`DELETE ${url}`, duration);
      return response.data;
    } catch (err: any) {
      throw _handleAxiosError(err, url, 'DELETE');
    }
  }

  static async postFile<T>(url: string, data: { [key: string]: any }) {
    try {
      const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: await this._getAuthHeaders('file'),
      });
      const startTime = performance.now();
      const response = await axiosInstance.post<T>(url, data);
      const duration = performance.now() - startTime;
      logger.performance(`POST FILE ${url}`, duration);
      return response.data;
    } catch (err: any) {
      throw _handleAxiosError(err, url, 'POST');
    }
  }

  static async put<T>(url: string, data: { [key: string]: any }) {
    try {
      const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: await this._getAuthHeaders(),
      });
      const startTime = performance.now();
      const response = await axiosInstance.put<T>(url, data);
      const duration = performance.now() - startTime;
      logger.performance(`PUT ${url}`, duration);
      return response.data;
    } catch (err: any) {
      throw _handleAxiosError(err, url, 'PUT');
    }
  }

  static async patch<T>(url: string, data: { [key: string]: any }) {
    try {
      const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: await this._getAuthHeaders(),
      });
      const startTime = performance.now();
      const response = await axiosInstance.patch<T>(url, data);
      const duration = performance.now() - startTime;
      logger.performance(`PATCH ${url}`, duration);
      return response.data;
    } catch (err: any) {
      throw _handleAxiosError(err, url, 'PATCH');
    }
  }

  /**
   * Get a file/blob response (for downloads)
   * @param url - API endpoint URL
   * @returns Blob response
   */
  static async getBlob(url: string): Promise<Blob> {
    try {
      const headers = await this._getAuthHeaders();
      // Remove Content-Type for blob requests, let browser handle it
      delete headers['Content-Type'];
      headers['Accept'] = '*/*';

      const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers,
        responseType: 'blob',
      });
      const startTime = performance.now();
      const response = await axiosInstance.get(url);
      const duration = performance.now() - startTime;
      logger.performance(`GET BLOB ${url}`, duration);
      return response.data;
    } catch (err: any) {
      // For blob responses, we need to check if the error response is also a blob
      if (err.response && err.response.data instanceof Blob) {
        // Try to parse error message from blob
        const text = await err.response.data.text();
        try {
          const errorData = JSON.parse(text);
          throw _handleAxiosError({ ...err, response: { ...err.response, data: errorData } }, url, 'GET');
        } catch {
          throw new Error('Failed to download file');
        }
      }
      throw _handleAxiosError(err, url, 'GET');
    }
  }
}

