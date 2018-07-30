require('dotenv').config()
const cron = require('node-cron')
const config = require('config')
const Meter = require('./meter/')

cron.schedule('0 0 */2 * * *', function () {
  Meter.checkMeter(config.mid)
})
