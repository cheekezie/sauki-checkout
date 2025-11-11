/**
 * Date Formatting Utilities
 * Helper functions for formatting dates and timestamps from the API
 */

/**
 * Formats a date string to a readable format
 * @param dateString - Date string (ISO format or timestamp)
 * @param format - Format style: 'short', 'long', 'time', 'datetime'
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date | undefined | null,
  format: 'short' | 'long' | 'time' | 'datetime' = 'short'
): string {
  if (!dateString) return '—';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (isNaN(date.getTime())) {
      return '—';
    }

    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      case 'long':
        return date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      case 'time':
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      case 'datetime':
        return date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      default:
        return date.toLocaleDateString('en-US');
    }
  } catch (error) {
    return '—';
  }
}

/**
 * Formats a timestamp string to "Mon Nov 03 2025 19:15:19 GMT+0000" format
 * @param timestampString - Timestamp string from API
 * @returns Formatted timestamp string
 */
export function formatTimestamp(timestampString: string | undefined | null): string {
  if (!timestampString) return '—';
  
  try {
    const date = new Date(timestampString);
    
    if (isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  } catch (error) {
    return '—';
  }
}

/**
 * Formats a relative time (e.g., "2 hours ago", "3 days ago")
 * @param dateString - Date string
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | Date | undefined | null): string {
  if (!dateString) return '—';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (isNaN(date.getTime())) {
      return '—';
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  } catch (error) {
    return '—';
  }
}

