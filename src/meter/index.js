const config = require('config')
const axios = require('axios')
const querystring = require('querystring')
const nodemailer = require('nodemailer')

module.exports = {
  checkMeter
}

async function checkMeter (mid) {
  let meterInfo = await getMeterInfo(mid)
  let info = meterInfo.meterAct
  let content = `
  <b>balanceAmount</b>: ${info.balanceAmount} <br>
  <b>lastReadTime</b>: ${info.lastReadTime} <br>
  <b>thisMonth</b>: ${info.thisMonth} <br>
  <b>mid</b>: ${info.mid} <br>
  <b>overdraftLimit</b>: ${info.overdraftLimit} <br>
  <b>overdraftMoney</b>: ${info.overdraftMoney} <br>
  `
  sendMail(content)
}

function sendMail (content) {
  nodemailer.createTestAccount(() => {
    let transporter = nodemailer.createTransport({
      host: config.mail.smtp,
      port: config.mail.smtpPort,
      secure: config.mail.secure,
      auth: {
        user: config.mail.user,
        pass: config.mail.pwd
      }
    })

    let mailOptions = {
      from: config.mail.user, // sender address
      to: config.mail.toUser, // list of receivers
      subject: 'meter info', // Subject line
      text: content, // plain text body
      html: `${content}` // html body
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: %s', info.messageId)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    })
  })
}

async function getMeterInfo (mid) {
  let postData = {
    'action': 'getmeteractinfo',
    'mid': mid,
    'time': 1234567
  }
  console.log(config.infoUrl)
  let res = await axios.post(config.infoUrl, querystring.stringify(postData))
  return res.data
}
