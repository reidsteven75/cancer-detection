const express = require('express')

const status = require('./status')
const images = require('./images')

const app = express()

const routes = (API_ROUTE) => {
  app.use(API_ROUTE + '/status', status)
  app.use(API_ROUTE + '/image', images)
  return app
}

module.exports = {
  routes
}