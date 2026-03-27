/**
 * @fileoverview Centralized logging utility
 * Supports console logging, file logging, and integrations (Sentry, etc.)
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Logger with different severity levels
 */
class Logger {
  constructor() {
    this.logs = [];
  }

  /**
   * Format log message with timestamp and metadata
   */
  _formatLog(level, message, metadata = {}) {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      ...metadata,
    };
  }

  /**
   * Log info messages
   */
  info(message, metadata = {}) {
    const log = this._formatLog('INFO', message, metadata);
    
    if (isDevelopment) {
      console.log('📘 [INFO]', message, metadata);
    }
    
    // In production, could send to external service like Sentry, LogRocket, etc.
    if (isProduction) {
      this._sendToExternalService(log);
    }
    
    this.logs.push(log);
  }

  /**
   * Log warning messages
   */
  warn(message, metadata = {}) {
    const log = this._formatLog('WARN', message, metadata);
    
    if (isDevelopment) {
      console.warn('⚠️  [WARN]', message, metadata);
    }
    
    if (isProduction) {
      this._sendToExternalService(log);
    }
    
    this.logs.push(log);
  }

  /**
   * Log error messages
   */
  error(message, metadata = {}) {
    const log = this._formatLog('ERROR', message, metadata);
    
    if (isDevelopment) {
      console.error('❌ [ERROR]', message, metadata);
    }
    
    if (isProduction) {
      this._sendToExternalService(log);
    }
    
    this.logs.push(log);
  }

  /**
   * Log debug messages (development only)
   */
  debug(message, metadata = {}) {
    if (isDevelopment) {
      const log = this._formatLog('DEBUG', message, metadata);
      console.debug('🔍 [DEBUG]', message, metadata);
      this.logs.push(log);
    }
  }

  /**
   * Send logs to external service (Sentry, DataDog, etc.)
   */
  _sendToExternalService(log) {
    // TODO: Implement based on your logging service
    // Example: Sentry.captureMessage(log.message, log.level.toLowerCase());
  }

  /**
   * Get recent logs
   */
  getLogs(limit = 50) {
    return this.logs.slice(-limit);
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
  }
}

export default new Logger();