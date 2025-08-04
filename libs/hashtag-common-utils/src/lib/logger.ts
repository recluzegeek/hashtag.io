import path from 'node:path';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors, splat } = format;

// const logPath = path.join(process.cwd(), '../../logs/');
const logPath = './logs';
// TODO: add file/module-name to logging
// TODO: make sure the logs dir is relative to root dir

// Custom log format for console output with colors and timestamp
const consoleFormat = combine(
	colorize({ all: true }),
	timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	errors({ stack: true }),
	splat(),
	printf(({ timestamp, level, message, stack }) => {
		return stack
			? `${timestamp} [${level}]: ${message} - ${stack}`
			: `${timestamp} [${level}]: ${message}`;
	}),
);

// Custom log format for files (plain text with timestamp and stack traces)
const fileFormat = combine(
	timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	errors({ stack: true }),
	splat(),
	printf(({ timestamp, level, message, stack }) => {
		return stack
			? `${timestamp} [${level}]: ${message} - ${stack}`
			: `${timestamp} [${level}]: ${message}`;
	}),
);

const logger = createLogger({
	level: 'silly', // log everything
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		http: 3,
		verbose: 4,
		debug: 5,
		silly: 6,
	},
	format: fileFormat, // default format (used by file transports)
	transports: [
		new transports.File({
			filename: path.join(logPath, 'error.log'),
			level: 'error',
			format: fileFormat,
			handleExceptions: true,
		}),
		new transports.File({
			filename: path.join(logPath, 'combined.log'),
			level: 'http', // http and above
			format: fileFormat,
		}),
		new transports.Console({
			format: consoleFormat,
			handleExceptions: true,
		}),
	],
	exitOnError: false,
});

export default logger;