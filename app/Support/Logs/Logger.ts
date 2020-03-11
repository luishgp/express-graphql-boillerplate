import { createLogger, transports, format } from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';

const enumerateErrorFormat = format(info => {
  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info,
    );
  }

  return info;
});

const console = new transports.Console({ level: 'debug' });

const consoleRotateFile = new winstonDailyRotateFile({
  dirname: './storage/app/logs',
  filename: 'app-console-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '3d',
});

let option;
const customFormatter = format.combine(enumerateErrorFormat(), format.json());

switch (process.env.NODE_ENV) {
  case 'development':
    option = {
      format: customFormatter,
      level: 'debug',
      transports: [console],
    };
    break;
  case 'production':
    option = {
      format: customFormatter,
      level: 'warn',
      transports: [consoleRotateFile],
    };
    break;
  default:
    option = {
      format: customFormatter,
      level: 'info',
      transports: [console],
    };
    break;
}

const log = createLogger(option);

export { log };
