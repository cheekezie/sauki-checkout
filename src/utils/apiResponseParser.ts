/**
 * API Response Parser Utility
 * Handles common API response parsing patterns across services
 */

/**
 * Parses API response to extract array data
 * Handles multiple response formats:
 * - Direct array: [...]
 * - Nested in data: { data: [...] }
 * - Nested in data.data: { data: { items: [...] } }
 * - Nested in result: { result: [...] }
 * - Nested in specific key: { [key]: [...] }
 */
export function parseArrayResponse<T>(
  response: any,
  options?: {
    dataKey?: string; // Key to extract array from (default: 'data')
    fallbackKeys?: string[]; // Alternative keys to check (default: ['result', 'items', 'students'])
  }
): T[] {
  const { dataKey = 'data', fallbackKeys = ['result', 'items', 'students'] } = options || {};

  // 1. Direct array: [...]
  if (Array.isArray(response)) {
    return response;
  }

  // 2. Nested in data: { data: [...] }
  if (response && typeof response === 'object' && dataKey in response) {
    const data = response[dataKey];

    // Check if data is directly an array: { data: [...] }
    if (Array.isArray(data)) {
      return data;
    }

    // Check if data has nested array: { data: { items: [...] } }
    if (data && typeof data === 'object') {
      // Check fallback keys
      for (const key of fallbackKeys) {
        if (key in data && Array.isArray(data[key])) {
          return data[key];
        }
      }
    }
  }

  // 3. Check fallback keys at root level
  if (response && typeof response === 'object') {
    for (const key of fallbackKeys) {
      if (key in response && Array.isArray(response[key])) {
        return response[key];
      }
    }
  }

  // 4. Return empty array if no match
  return [];
}

/**
 * Parses API response to extract single object data
 * Handles multiple response formats:
 * - Direct object: { ... }
 * - Nested in data: { data: { ... } }
 */
export function parseObjectResponse<T>(
  response: any,
  options?: {
    dataKey?: string; // Key to extract object from (default: 'data')
  }
): T | null {
  const { dataKey = 'data' } = options || {};

  // 1. Direct object: { ... }
  if (response && typeof response === 'object' && !('data' in response)) {
    // Check if it looks like the actual data (has common fields)
    if ('_id' in response || 'id' in response) {
      return response as T;
    }
  }

  // 2. Nested in data: { data: { ... } }
  if (response && typeof response === 'object' && dataKey in response) {
    const data = response[dataKey];
    if (data && typeof data === 'object') {
      return data as T;
    }
  }

  // 3. Return null if no match
  return null;
}

