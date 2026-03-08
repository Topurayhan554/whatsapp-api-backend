const { createLogger, format, transports } = require("winston");
const path = require("path");

const logger = createLogger({
  level: "info",

  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
        : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),

  transports: [
    // Terminal
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
    }),

    // logs/error.log
    new transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),

    // logs/combined.log
    new transports.File({
      filename: path.join("logs", "combined.log"),
    }),
  ],
});

module.exports = logger;
