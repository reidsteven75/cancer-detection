const express = require('express')

const Logger = require('../logger.js')
const logger = Logger.init()

const app = express()

app.get('/', (req, res) => {
	logger.info('works!')
	res.send({test:'works!'})
}) 

module.exports = app