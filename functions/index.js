const functions = require('firebase-functions')
const cors = require('cors')({origin: true})
const https = require('https')

exports.prices = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    https.get('https://api.coinmarketcap.com/v1/ticker/', res => {
      let body = ''
      res.on('data', d => {
        body += d
      })
      res.on('end', () => {
        const parsed = JSON.parse(body)
        console.log(parsed)
        response.send(parsed)
      })
      res.on('error', (e) => {
        console.error(`Got error: ${e.message}`)
        response.status(200).send(e.message)
      })
    })
  })
})
