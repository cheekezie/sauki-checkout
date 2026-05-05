import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types/api.types';
import encHex from 'crypto-js/enc-hex';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import { logger } from '../logger.service';
import { decryptNestedResponse } from '@/utils/decryption';
import security from '@/utils/security_algorithm';
import { ENCRYPTION_KEY, API_BASE_URL } from '@/config/constants';

// --- Global handlers (set by AuthProvider / ToastProvider after mount) ---

type AuthErrorHandler = (errorMessage?: string) => void;
type ToastErrorHandler = (message: string, type?: 'error' | 'warning') => void;

let globalAuthErrorHandler: AuthErrorHandler | null = null;
let globalToastErrorHandler: ToastErrorHandler | null = null;
let isHandlingAuthError = false;

export const setGlobalAuthErrorHandler = (handler: AuthErrorHandler) => {
  globalAuthErrorHandler = handler;
};

export const setGlobalToastErrorHandler = (handler: ToastErrorHandler) => {
  globalToastErrorHandler = handler;
};

// --- Signature ---

export const generateSignature = async (
  accountId: string
): Promise<{ signature: string; timeStamp: number }> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) throw new Error('VITE_API_KEY is required for signature generation');
  const timeStamp = Math.floor(Date.now() / 1000);
  const signature = hmacSHA512(`${accountId}:${timeStamp}`, apiKey).toString(encHex);
  return { signature, timeStamp };
};

// --- Error types ---

export class ApiError extends Error {
  statusCode?: number;
  code?: number;

  constructor(message: string, statusCode?: number, code?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

// --- Helpers ---

const isAxiosError = (err: unknown): err is AxiosError<Record<string, unknown>> =>
  typeof err === 'object' && err !== null && 'isAxiosError' in err &&
  (err as { isAxiosError: unknown }).isAxiosError === true;

const extractMessage = (message: unknown): string => {
  if (typeof message === 'string') return message;
  if (Array.isArray(message) && message.length > 0) return String(message[0]);
  if (typeof message === 'object' && message !== null) {
    const first = Object.values(message as Record<string, unknown>)[0];
    if (typeof first === 'string') return first;
    if (Array.isArray(first) && first.length > 0) return String(first[0]);
  }
  return 'An error occurred';
};

const trigger401Logout = (message: string) => {
  if (globalAuthErrorHandler && !isHandlingAuthError) {
    isHandlingAuthError = true;
    globalAuthErrorHandler(message);
    setTimeout(() => { isHandlingAuthError = false; }, 2000);
  }
};

const handleAxiosError = (err: unknown, endpoint?: string, method?: string) => {
  if (isAxiosError(err) && err.response) {
    const { status, data } = err.response as { status: number; data: Record<string, unknown> };

    if (endpoint && method) logger.apiError(endpoint, method, err);
    else logger.error('API request failed', err);

    if (status === 401 || data?.code === 401 || data?.statusCode === 401) {
      const message =
        (typeof data.message === 'string' ? data.message : null) ||
        (typeof data.error === 'string' ? data.error : null) ||
        'Your session has expired. Please log in again.';
      trigger401Logout(message);
      return { ...data, message, status: 'error', statusCode: 401, code: 401 };
    }

    const message = data.message
      ? extractMessage(data.message)
      : typeof data.error === 'string'
        ? data.error
        : status === 500 || status === 503
          ? 'Unable to process request. Try again'
          : 'An error occurred';

    globalToastErrorHandler?.(message, 'error');
    return { ...data, message, status: 'error', statusCode: status, code: data.code || status };
  }

  if (isAxiosError(err)) {
    logger.error('Network error occurred', err);
    const message =
      err.code === 'ECONNABORTED' || err.message?.includes('timeout')
        ? 'Request timeout. Please check your connection and try again.'
        : err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')
          ? 'Network error. Please check your internet connection and try again.'
          : err.message || 'Unable to connect to the server. Please try again later.';
    globalToastErrorHandler?.(message, 'error');
    return { message, status: 'error', statusCode: 1000, code: 1000 };
  }

  logger.error('Unknown error occurred', err);
  const message =
    err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string'
      ? (err as any).message || 'A system error occurred'
      : 'A system error occurred';
  globalToastErrorHandler?.(message, 'error');
  return { message, status: 'error', statusCode: 1000, code: 1000 };
};

const rejectWithApiError = (err: unknown): never => {
  if (isAxiosError(err) && err.response) {
    const { status, data } = err.response as { status: number; data: Record<string, unknown> };
    const message = (data?.message as string) || (data?.error as string) || 'Request failed';
    return Promise.reject(new ApiError(message, status, status)) as never;
  }
  return Promise.reject(new ApiError(err instanceof Error ? err.message : 'Network error', 1000)) as never;
};

// --- Axios instance factory ---

const createInstance = (headers: Record<string, string>, withCredentials = true): AxiosInstance => {
  const instance = axios.create({ baseURL: API_BASE_URL, headers, withCredentials });

  // Encrypt outgoing payloads
  instance.interceptors.request.use(async (config) => {
    if (!config.data || config.method?.toLowerCase() === 'get') return config;

    const contentType = config.headers?.['Content-Type'] || config.headers?.['content-type'] ||
      headers['Content-Type'] || headers['content-type'];
    if (contentType?.includes('multipart/form-data')) return config;

    // Already encrypted
    if (typeof config.data === 'object' && 'data' in config.data && typeof config.data.data === 'string')
      return config;

    if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is required for encryption');
    try {
      config.data = { data: await security.encrypt(JSON.stringify(config.data), ENCRYPTION_KEY) };
    } catch (error: any) {
      logger.error('Failed to encrypt request payload', error);
      throw new Error(`Encryption failed: ${error.message}`);
    }
    return config;
  });

  // Decrypt incoming payloads + handle 401 centrally
  instance.interceptors.response.use(
    async (response: AxiosResponse) => {
      if (response.data) {
        try {
          response.data = await decryptNestedResponse(response.data);
        } catch {
          // Not encrypted — leave as-is
        }
      }
      return response;
    },
    (error) => {
      const status = error?.response?.status;
      const data = error?.response?.data ?? {};
      if (status === 401 || data?.code === 401 || data?.statusCode === 401) {
        const message =
          (typeof data.message === 'string' ? data.message : null) ||
          (typeof data.error === 'string' ? data.error : null) ||
          'Your session has expired. Please log in again.';
        trigger401Logout(message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// --- Headers ---

const publicHeaders = (file?: 'file' | 'json'): Record<string, string> => ({
  Accept: 'application/json',
  "User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  'Content-Type': file === 'file' ? 'multipart/form-data' : 'application/json',
});

const authHeaders = async (file?: 'file' | 'json'): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    'Content-Type': file === 'file' ? 'multipart/form-data' : 'application/json',
  };
  const activeOrgId = localStorage.getItem('active_org_id');
  if (activeOrgId) {
    headers['X-Business-Id'] = activeOrgId;
    headers['Business-Id'] = activeOrgId;
  }
  return headers;
};

const validateUrl = (url: string) => {
  if (!url || url.includes('undefined'))
    throw new ApiError('API endpoint not configured.', 400);
};

// --- RequestService ---

export class RequestService {
  /** @deprecated use module-level generateSignature */
  static generateSignature = generateSignature;
  static _getPublicHeaders = publicHeaders;
  static _getAuthHeaders = authHeaders;
  static constructQueryString = (params: Record<string, unknown>): string =>
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');

  static async get<T = unknown>(url: string, params?: object): Promise<ApiResponse<T>> {
    if (params) {
      const qs = RequestService.constructQueryString(params as Record<string, unknown>);
      if (qs) url = `${url}?${qs}`;
    }
    validateUrl(url);
    try {
      const instance = createInstance(await authHeaders());
      const t = performance.now();
      const res = await instance.get<ApiResponse<T>>(url);
      logger.performance(`GET ${url}`, performance.now() - t);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, url, 'GET');
    }
  }

  static async post<T = unknown>(url: string, data: any, useAuth = true, withCredentials = true): Promise<ApiResponse<T>> {
    validateUrl(url);
    try {
      const headers = useAuth ? await authHeaders() : publicHeaders();
      const instance = createInstance(headers, withCredentials);
      const t = performance.now();
      const res = await instance.post<ApiResponse<T>>(url, data);
      logger.performance(`POST ${url}`, performance.now() - t);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, url, 'POST');
    }
  }

  static async put<T = unknown>(url: string, data: any): Promise<ApiResponse<T>> {
    validateUrl(url);
    try {
      const instance = createInstance(await authHeaders());
      const t = performance.now();
      const res = await instance.put<ApiResponse<T>>(url, data);
      logger.performance(`PUT ${url}`, performance.now() - t);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, url, 'PUT');
    }
  }

  static async patch<T = unknown>(url: string, data: Record<string, unknown>, withCredentials = true, skipAuthErrorHandler = false): Promise<ApiResponse<T>> {
    validateUrl(url);
    try {
      const instance = createInstance(await authHeaders(), withCredentials);
      const t = performance.now();
      const res = await instance.patch<ApiResponse<T>>(url, data);
      logger.performance(`PATCH ${url}`, performance.now() - t);
      return res.data;
    } catch (err) {
      if (skipAuthErrorHandler) return rejectWithApiError(err);
      throw handleAxiosError(err, url, 'PATCH');
    }
  }

  static async delete<T = unknown>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    validateUrl(url);
    try {
      const instance = createInstance(await authHeaders());
      const t = performance.now();
      const res = await instance.delete<ApiResponse<T>>(url, { data });
      logger.performance(`DELETE ${url}`, performance.now() - t);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, url, 'DELETE');
    }
  }

  static async postFile<T = unknown>(url: string, data: FormData | Record<string, unknown>): Promise<ApiResponse<T>> {
    validateUrl(url);
    try {
      const instance = createInstance(await authHeaders('file'));
      const t = performance.now();
      const res = await instance.post<ApiResponse<T>>(url, data);
      logger.performance(`POST FILE ${url}`, performance.now() - t);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, url, 'POST');
    }
  }

  static async getBlob(url: string): Promise<Blob> {
    validateUrl(url);
    try {
      const headers = await authHeaders();
      delete headers['Content-Type'];
      headers['Accept'] = '*/*';
      const instance = axios.create({ baseURL: API_BASE_URL, headers, responseType: 'blob', withCredentials: true });
      const t = performance.now();
      const res = await instance.get(url);
      logger.performance(`GET BLOB ${url}`, performance.now() - t);
      return res.data;
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const blob = (err as any).response?.data;
        if (blob instanceof Blob) {
          try {
            const errorData = JSON.parse(await blob.text());
            throw handleAxiosError({ ...err, response: { ...(err as any).response, data: errorData } }, url, 'GET');
          } catch { throw new ApiError('Failed to download file', 500); }
        }
      }
      throw handleAxiosError(err, url, 'GET');
    }
  }
}
