import winston from 'winston';
import { format }  from 'date-fns';
import DailyRotateFile from 'winston-daily-rotate-file';




// Function to generate the log file name based on the log type
const getLogFileName = (logType) => {
 
  return `public/logs/${logType}.log`;
};

// Create a Winston logger instance for each log type
export const webLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({}),
    new DailyRotateFile({
      filename: getLogFileName('web'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '7d'
    })
  ]
});

export const sdkLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: getLogFileName('sdk'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '7d'
    })
  ]
});

export const portalLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: getLogFileName('portal'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '7d'
    })
  ]
});




// Log some example messages for each log type