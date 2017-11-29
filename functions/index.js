const functions = require('firebase-functions')
const cors = require('cors')({origin: true})
const axios = require('axios')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// console.log stores all logs in Google Cloud logs
const handleError = error => {
  if (error.response) {
    console.log(error.response.data)
    console.log(error.response.status)
    console.log(error.response.headers)
  } else if (error.request) {
    console.log(error.request)
  } else {
    console.log('Error', error.message)
  }
  console.log(error.config)
}

const fetchMarketData = () => {
  return new Promise((resolve, reject) => {
    axios.get('https://api.coinmarketcap.com/v1/ticker/').then(res => {
      const parsed = res.data
      const prices = parsed.reduce((prices, coin) => {
        prices[coin.symbol] = parseFloat(coin.price_usd)
        return prices
      }, {})
      const tickers = parsed.reduce((tickers, coin) => {
        tickers[coin.symbol] = coin
        return tickers
      }, {})
      resolve({
        prices,
        tickers
      })
    }).catch(error => {
      reject(error)
      handleError(error)
    })
  })
}

const fetchSentimentData = () => {
  return new Promise((resolve, reject) => {
    axios.get('https://api.santiment.net/api/daily_prices?tickers=MIOTA,BTC,BCH,BTG,QTUM,HSR,NEO,EOS,OMG,ADA,XLM,USDT').then(res => {
      const parsed = res.data
      resolve(parsed)
    }).catch(error => {
      reject(error)
      handleError(error)
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
