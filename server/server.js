require('dotenv').config({ path: 'build/.env' })
require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' })

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const winston = require('winston')
const path = require('path')
const bodyParser = require('body-parser')
const _ = require('lodash')
const moment = require('moment')
const Multer = require('multer')

const TumorDetector2D = require('./tf-models/tumor-detector-2d.js')

const ENVIRONMENT = process.env.NODE_ENV || 'development'
const HTTPS = (process.env.HTTPS === 'true')
const HOST = (HTTPS ? 'https://' : 'http://') + process.env.HOST
const API_PORT = process.env.API_PORT || process.env.PORT
const API_ROUTE = '/api'
const WEB_APP_ROUTE = ''
const WEB_APP_PATH = 'build/web-app'

const config = {

}

const loggerLevels = {
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

const logger = winston.createLogger({
	level: 'debug',
	levels: loggerLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [new winston.transports.Console()]
})

winston.addColors(loggerLevels.colors)

const logRequests = (req, res, next) => {
	logger.info(`[${req.method}] ${req.originalUrl}`)
	next()
}

const multer = Multer({
	// storage: Multer.memoryStorage(),
	dest: 'files/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 mb max
  },
})


app.use(logRequests)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(WEB_APP_PATH))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.get(API_ROUTE + '/status', (req, res) => {
	res.send({test:'works!'})
})

app.post(API_ROUTE + '/image/analyze',  multer.single('image'), (req, res) => {
	
	if (!req.file) {
		res.status(400).send({err: true});
		console.log('no file uploaded')
    return;
	}

	const metadata = req.body
	const file = req.file

	TumorDetector2D.predict(file.path)

	setTimeout(() => {
		return res.send({tumor: false})
		// return res.send({
		// 	error: true,
		// 	message: 'Server Failed'
		// })
	}, 2000)
	
})

// web-app
// -------
app.get(WEB_APP_ROUTE, (req, res) => {
	res.sendFile(path.resolve(path.join(WEB_APP_PATH), 'index.html'))
})

// server
// ------
server.listen(API_PORT, () => {
	logger.info('~~~~~~~~~~~~~~~~~~~~~~~~~~')
	logger.info('~= Cancer Detection API =~')
	logger.info('ENV: ' + ENVIRONMENT)
	logger.info('URL: ' + HOST + ':' + API_PORT + API_ROUTE)

	TumorDetector2D.init()
})