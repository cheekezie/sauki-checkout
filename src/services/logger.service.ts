/**
 * Centralized Logging Service
 * Replaces console.log/error/warn with environment-aware logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

const LOG_LEVELS: Record<LogLevel, number> = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

class LoggerService {
  private currentLevel: LogLevel;

  constructor() {
    const envLevel = (import.meta.env.VITE_LOG_LEVEL || 'info').toLowerCase() as LogLevel;
    this.currentLevel = LOG_LEVELS[envLevel] !== undefined ? envLevel : 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.currentLevel];
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error | any, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error, ...args);
    }
  }

  apiError(endpoint: string, method: string, error: any): void {
    if (this.shouldLog('error')) {
      console.error(`[API ERROR] ${method.toUpperCase()} ${endpoint}`, {
        message: error.message,
        status: error.status,
        statusCode: error.statusCode,
        response: error.response?.data,
      });
    }
  }

  authError(operation: string, error: any): void {
    if (this.shouldLog('error')) {
      console.error(`[AUTH ERROR] ${operation}`, {
        message: error.message,
        status: error.status,
        statusCode: error.statusCode,
      });
    }
  }

  userAction(action: string, details?: Record<string, any>): void {
    if (this.shouldLog('info')) {
      console.info(`[USER ACTION] ${action}`, details || {});
    }
  }

  performance(operation: string, duration: number, metadata?: Record<string, any>): void {
    if (this.shouldLog('debug')) {
      console.debug(`[PERFORMANCE] ${operation} took ${duration}ms`, metadata || {});
    }
  }
}

export const logger = new LoggerService();

