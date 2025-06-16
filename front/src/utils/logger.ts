type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string): LogMessage {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  private log(level: LogLevel, message: string): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(level, message);
      // eslint-disable-next-line no-console
      console.log(`[${formattedMessage.timestamp}] ${level.toUpperCase()}: ${formattedMessage.message}`);
    }
  }

  public info(message: string): void {
    this.log('info', message);
  }

  public warn(message: string): void {
    this.log('warn', message);
  }

  public error(message: string): void {
    this.log('error', message);
  }

  public debug(message: string): void {
    this.log('debug', message);
  }
}

export const logger = Logger.getInstance(); 