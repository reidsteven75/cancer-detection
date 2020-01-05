const winston = require('winston')

const config = {
  levels: {
    error: 0, 
    warn: 1, 
    info: 2, 
    verbose: 3, 
    debug: 4, 
    silly: 5
  },
  colors: {
    error: 'red', 
    warn: 'yellow', 
    info: 'cyan', 
    verbose: 'green', 
    debug: 'blue', 
    silly: 'gray'
  }
}

const init = () => {
  
  logger = winston.createLogger({
    level: 'debug',
    levels: config.levels,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()]
  })
  winston.addColors(config.colors)

  return logger
}

const requestMiddleware = (req, res, next) => {
  logger.info(`[${req.method}] ${req.originalUrl}`)
  next()
}

module.exports = {
  init,
  requestMiddleware
}
