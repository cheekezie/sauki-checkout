/**
 * Decryption Utility
 * Handles decryption of encrypted API responses using AES-256-GCM
 */

import security from './security_algorithm';
import { ENCRYPTION_KEY } from '@/config/constants';
import { logger } from '@/services/logger.service';

/**
 * Decrypt an encrypted response string
 * @param encryptedData - The encrypted string to decrypt (base64 encoded)
 * @returns The decrypted object or data
 */
export async function decryptResponse<T = any>(
  encryptedData: string
): Promise<T> {
  if (!ENCRYPTION_KEY) {
    throw new Error(
      'ENCRYPTION_KEY is required for decrypting responses. ' +
      'Please set VITE_ENCRYPTION_KEY in your environment variables.'
    );
  }

  if (!encryptedData || typeof encryptedData !== 'string') {
    throw new Error('Invalid encrypted data: must be a non-empty string');
  }

  try {
    const decryptedString = await security.decrypt(
      encryptedData,
      ENCRYPTION_KEY
    );

    if (!decryptedString) {
      throw new Error(
        'Failed to decrypt response - invalid key or data format'
      );
    }

    const parsed = JSON.parse(decryptedString);
    return parsed as T;
  } catch (error: any) {
    throw new Error(
      `Decryption failed: ${error.message}. ` +
      'Please verify that ENCRYPTION_KEY is correct and matches the backend encryption.'
    );
  }
}

/**
 * Check if a string appears to be encrypted
 * @param data - The string to check
 * @returns True if the string appears to be encrypted
 */
export function isEncrypted(data: string): boolean {
  if (typeof data !== 'string' || !data) {
    return false;
  }

  const isLongBase64Like = data.length > 40 && /^[A-Za-z0-9+/=]+$/.test(data);
  const isNotJson =
    !data.trim().startsWith('{') && !data.trim().startsWith('[');

  return isLongBase64Like && isNotJson;
}
/**
 * Decrypt nested response data if present
 * Handles responses that have encrypted data nested in a 'data' field
 * @param response - The API response object
 * @returns The response with decrypted data field if it was encrypted
 */
export async function decryptNestedResponse<T = any>(
  response: any
): Promise<T> {
  if (!response) {
    return response;
  }

  if (
    response.data?.data &&
    typeof response.data.data === 'string' &&
    isEncrypted(response.data.data)
  ) {
    try {
      const decrypted = await decryptResponse(response.data.data);
      return {
        ...response,
        data: decrypted,
      } as T;
    } catch (error) {
      logger.warn('Failed to decrypt nested response data', error);
      return response as T;
    }
  }

  if (
    response.data &&
    typeof response.data === 'string' &&
    isEncrypted(response.data)
  ) {
    try {
      const decrypted = await decryptResponse(response.data);
      return {
        ...response,
        data: decrypted,
      } as T;
    } catch (error) {
      logger.warn('Failed to decrypt response data', error);
      return response as T;
    }
  }

  return response as T;
}

/**
 * Synchronous version for backwards compatibility (if needed)
 * Note: This will only work for already-decrypted data or throw an error
 */
export function decryptResponseSync<T = any>(_encryptedData: string): T {
  throw new Error(
    'Synchronous decryption is not supported with AES-256-GCM. ' +
    'Please use decryptResponse() which returns a Promise.'
  );
}
