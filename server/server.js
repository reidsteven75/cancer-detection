require('dotenv').config({ path: 'build/.env' })
require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' })

const express = require('express')
const app = express()
const server = require('http').Server(app)
const path = require('path')
const bodyParser = require('body-parser')
const _ = require('lodash')

const Api = require('./api')
const Logger = require('./logger.js')
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

const logger = Logger.init()

app.use(Logger.requestMiddleware)
		.use(bodyParser.json())
		.use(bodyParser.urlencoded({ extended: true }))
		.use(express.static(WEB_APP_PATH))
		.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			next();
		})
		.use(Api.routes(API_ROUTE))

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