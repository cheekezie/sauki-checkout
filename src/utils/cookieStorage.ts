import Cookies from "js-cookie";

/**
 * Interface for cached data structure with expiration
 */
export interface CachedData<T> {
  data: T;
  expiresAt: number;
}

/**
 * Default cookie expiry in days
 */
const DEFAULT_EXPIRY_DAYS = 14;

/**
 * Retrieves cached data from cookie with expiry validation
 * @param cookieName - Name of the cookie to retrieve
 * @returns Parsed data if valid and not expired, null otherwise
 */
export function getCachedData<T>(cookieName: string): T | null {
  const cachedData = Cookies.get(cookieName);
  if (!cachedData) return null;

  try {
    const parsed: CachedData<T> = JSON.parse(cachedData);
    const currentTime = new Date().getTime();

    // Check if data has expired
    if (currentTime > parsed.expiresAt) {
      Cookies.remove(cookieName);
      return null;
    }

    return parsed.data;
  } catch (error) {
    // Invalid cookie data - remove it
    Cookies.remove(cookieName);
    return null;
  }
}

/**
 * Stores data in cookie with expiration
 * @param cookieName - Name of the cookie to store
 * @param data - Data to store (will be JSON stringified)
 * @param expiryDays - Number of days until cookie expires (default: 14)
 */
export function storeCookie<T>(
  cookieName: string,
  data: T,
  expiryDays: number = DEFAULT_EXPIRY_DAYS
): void {
  const expiresAt = new Date().getTime() + expiryDays * 24 * 60 * 60 * 1000;
  const cookieData: CachedData<T> = { data, expiresAt };

  Cookies.set(cookieName, JSON.stringify(cookieData), {
    expires: expiryDays,
    sameSite: "strict", // Security best practice
    secure: window.location.protocol === "https:", // Secure cookies in production
  });
}

/**
 * Removes a cookie by name
 * @param cookieName - Name of the cookie to remove
 */
export function removeCookie(cookieName: string): void {
  Cookies.remove(cookieName);
}



