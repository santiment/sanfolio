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
        try {
          const parsed = JSON.parse(body)
          const prices = parsed.reduce((prices, coin) => {
            prices[coin.symbol] = parseFloat(coin.price_usd)
            return prices
          }, {})
          const tickers = parsed.reduce((tickers, coin) => {
            tickers[coin.symbol] = coin
            return tickers
          }, {})
          console.log('Data fetched from CMC.')
          resolve({
            prices,
            tickers
          })
        } catch (e) {
          console.error(`Got error: ${e.message}`)
          reject(e)
        }
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
        try {
          const parsed = JSON.parse(body)
          console.log(parsed)
          resolve(parsed)
        } catch (e) {
          console.error(`Got error: ${e.message}`)
          reject(e)
        }
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
          const {prices, tickers} = values[0]
          admin.database().ref('/last').update({
            history,
            tickers,
            prices,
            created: admin.database.ServerValue.TIMESTAMP
          })
          resolve({
            prices,
            history,
            tickers
          })
        }).catch(e => {
          console.log('error')
          reject(e)
        })
      } else {
        resolve({
          prices: prevData.prices,
          history: prevData.history,
          tickers: prevData.tickers
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

exports.tickers = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    makeResponse().then(data => {
      if (request.query.symbol === undefined) {
        response.send(data.tickers)
      } else {
        const symbol = request.query.symbol
        response.send(data.tickers[symbol])
      }
    }).catch(e => {
      response.status(500).send(e)
    })
  })
})
