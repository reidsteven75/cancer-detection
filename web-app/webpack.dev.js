const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const EventHooksPlugin = require('event-hooks-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: process.env.HOST,
    port: process.env.WEB_APP_PORT,
    historyApiFallback: true,
    stats: 'errors-only'
  },
  plugins: [
    new EventHooksPlugin({
      done: () => {
        const HTTPS = (process.env.HTTPS === 'true')
        const HOST = (HTTPS ? 'https://' : 'http://') + process.env.HOST

        console.info('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        console.info('~= Cancer Detection Web App =~')
        console.info('ENV: ' + process.env.NODE_ENV)
        console.info('URL: ' + HOST + ':' + process.env.WEB_APP_PORT)
      }
    })
  ]
})