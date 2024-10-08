const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'winston service' },
  transports: [
    new transports.File({ filename: 'log/error.log', level: 'error' }),
    new transports.File({ filename: 'log/info.log', level: 'info' }),
    new transports.File({ filename: 'log/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.simple()
    })
  );
}

module.exports = { logger };
