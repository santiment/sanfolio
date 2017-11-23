const functions = require('firebase-functions')
const cors = require('cors')({origin: true})
const https = require('https')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const fetchMarketData = () => {
  return new Promise((resolve, reject) => {
    https.get('https://api.coinmarketcap.com/v1/ticker/', res => {
      let body = ''
      res.on('data', d => {
        body += d
      })
      res.on('end', () => {
        const parsed = JSON.parse(body)
        const prices = parsed.reduce((prices, coin) => {
          prices[coin.symbol] = parseFloat(coin.price_usd)
          return prices
        }, {})
        console.log(prices)
        resolve(prices)
      })
      res.on('error', (e) => {
        console.error(`Got error: ${e.message}`)
        reject(e)
      })
    })
  })
}

const fetchSentimentData = () => {
  return new Promise((resolve, reject) => {
    https.get('https://api.santiment.net/api/daily_prices?tickers=MIOTA,QTUM,HSR,NEO,EOS,OMG,ADA,XLM,USDT', res => {
      let body = ''
      res.on('data', d => {
        body += d
      })
      res.on('end', () => {
        const parsed = JSON.parse(body)
        console.log(parsed)
        resolve(parsed)
      })
      res.on('error', (e) => {
        console.error(`Got error: ${e.message}`)
        reject(e)
      })
    })
  })
}

const makeResponse = () => {
  return new Promise((resolve, reject) => {
    admin.database().ref('/last').once('value').then(snap => {
      const prevData = snap.val()
      const now = new Date()
      const lastReq = new Date(prevData.created)
      if (now - lastReq > 5 * 60 * 1000) {
        console.log('update fetched data')
        const pricesPr = fetchMarketData()
        const historyPr = fetchSentimentData()
        Promise.all([pricesPr, historyPr]).then(values => {
          const history = values[1]
          const prices = values[0]
          admin.database().ref('/last').update({history})
          admin.database().ref('/last').update({
            prices,
            created: admin.database.ServerValue.TIMESTAMP
          })
          resolve({
            prices: values[0],
            history: values[1]
          })
        }).catch(e => {
          console.log('error')
          reject(e)
        })
      } else {
        resolve({
          prices: prevData.prices,
          history: prevData.history
        })
      }
    }).catch(e => {
      console.log('error')
      reject(e)
    })
  })
}

exports.prices = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    makeResponse().then(data => {
      response.send(data.prices)
    }).catch(e => {
      response.status(500).send(e)
    })
  })
})

exports.history = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    makeResponse().then(data => {
      response.send(data.history)
    }).catch(e => {
      response.status(500).send(e)
    })
  })
})
