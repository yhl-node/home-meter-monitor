require('dotenv').config()
const cron = require('node-cron')
const config = require('config')
const Meter = require('./meter/')

cron.schedule('* * * * *', function () {
  Meter.checkMeter(config.mid)
})
