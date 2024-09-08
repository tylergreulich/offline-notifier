import { createLogger, format, type Logger, transports } from 'winston'

export const createWinstonLogger = (serviceName: string): Logger => {
  const winstonLogger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss' }), format.json()),
    defaultMeta: { service: serviceName },
    transports: [
      new transports.File({
        filename: `./src/winston/${serviceName}/error.log`,
        level: 'error'
      }),
      new transports.File({
        filename: `./src/winston/${serviceName}/info.log`,
        level: 'info'
      })
    ]
  })
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    winstonLogger.add(
      new transports.Console({
        format: format.simple()
      })
    )
  }

  return winstonLogger
}
