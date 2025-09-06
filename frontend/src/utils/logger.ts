import { config } from '../config/app';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  [key: string]: unknown;
}

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = config.isDevelopment();
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.isDevelopment && level === LogLevel.DEBUG) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    
    const logEntry = {
      timestamp,
      level: levelName,
      message,
      ...context,
    };

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[${timestamp}] DEBUG: ${message}`, context);
        break;
      case LogLevel.INFO:
        console.info(`[${timestamp}] INFO: ${message}`, context);
        break;
      case LogLevel.WARN:
        console.warn(`[${timestamp}] WARN: ${message}`, context);
        break;
      case LogLevel.ERROR:
        console.error(`[${timestamp}] ERROR: ${message}`, context);
        break;
    }

    // In production, you might want to send logs to a service
    if (!this.isDevelopment && level >= LogLevel.ERROR) {
      this.sendToLoggingService(logEntry);
    }
  }

  private sendToLoggingService(logEntry: any): void {
    // TODO: Implement logging service integration (e.g., Sentry, LogRocket)
    // For now, just store in sessionStorage for debugging
    try {
      const logs = JSON.parse(sessionStorage.getItem('app-logs') || '[]');
      logs.push(logEntry);
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      sessionStorage.setItem('app-logs', JSON.stringify(logs));
    } catch (error) {
      // Silently fail if sessionStorage is not available
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context);
  }

  // Utility methods for common logging patterns
  apiCall(method: string, url: string, context?: LogContext): void {
    this.debug(`API Call: ${method} ${url}`, { ...context, action: 'api_call' });
  }

  apiResponse(method: string, url: string, status: number, context?: LogContext): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.DEBUG;
    this.log(level, `API Response: ${method} ${url} - ${status}`, { 
      ...context, 
      action: 'api_response',
      status 
    });
  }

  componentMount(component: string): void {
    this.debug(`Component mounted: ${component}`, { component, action: 'mount' });
  }

  componentUnmount(component: string): void {
    this.debug(`Component unmounted: ${component}`, { component, action: 'unmount' });
  }

  userAction(action: string, context?: LogContext): void {
    this.info(`User action: ${action}`, { ...context, action });
  }
}

export const logger = new Logger();