import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import axios from 'axios'
import Raven from 'raven-js'
import createRavenMiddleware from 'raven-for-redux'
import { multiClientMiddleware } from 'redux-axios-middleware'
import thunk from 'redux-thunk'
import { cloud, db } from './cloud'
import './index.css'
import App from './App'
import reducers from './rootReducers.js'
import registerServiceWorker from './registerServiceWorker'

Raven.config('https://9811855f854f41d88f0ad2c41e006c33@sentry.io/247999').install()

const clients = {
  lionClient: {
    client: axios.create({
      baseURL: 'https://api.lionshare.capital/api',
      responseType: 'json'
    })
  },
  marketCapClient: {
    client: axios.create({
      baseURL: 'https://us-central1-cryptofolio-15d92.cloudfunctions.net',
      responseType: 'json'
    })
  }
}

const middleware = [
  multiClientMiddleware(clients),
  createRavenMiddleware(Raven, {
    filterBreadcrumbActions: action => {
      return action.type !== 'FIRE_TICKET'
    }
    // Optionally pass some options here.
  }),
  thunk
]

let preloadedState
if (process.env.NODE_ENV === 'production') {
  preloadedState = {}
} else {
  preloadedState = {
    settings: {
      realtime: false
    }
  }
}

const store = createStore(reducers,
  preloadedState,
  composeWithDevTools(applyMiddleware(...middleware))
)

// FIXME: refactor this place
// TODO: added message for user, if portfolio exists or counts more than 4.
// Save current anonymus portfolios
// Fetch the user portfolios from cloud
// Check ofc, if the user has not the same name portfolio
// and counts less than 4 portfolios on user account
const saveAndFetchPortfolios = async (uid, store) => {
  const items = store.getState().portfolios.items
  await db.ref('portfolios').child(uid).once('value', async (snapshot) => {
    let portfolios = []
    snapshot.forEach(data => {
      portfolios.push(data.val())
    })

    if (portfolios.length < 4) {
      for (let item of items) {
        const sameUrlFolio = portfolios.find(el => {
          return el.url === item.url
        })
        if (!sameUrlFolio) {
          await db.ref('portfolios').child(uid).push({
            name: item.name,
            data: item.data,
            url: item.url,
            firstMoney: item.money,
            createdAt: cloud.database.ServerValue.TIMESTAMP
          })
        }
      }
    }
  })
  await db.ref('portfolios').child(uid).once('value', (snapshot) => {
    let portfolios = {}
    snapshot.forEach(data => {
      portfolios[`${data.key}`] = data.val()
    })
    store.dispatch({
      type: 'SUCCESS_FETCHED_PORTFOLIOS',
      portfolios
    })
  })
}

cloud.auth().onAuthStateChanged((user) => {
  if (!user) {
    store.dispatch({
      type: 'APP_LOADING'
    })
  } else {
    let _user = {}
    _user.uid = user.uid
    _user.email = user.email
    store.dispatch({
      type: 'SUCCESS_LOGIN',
      user: _user
    })
    saveAndFetchPortfolios(user.uid, store)
    Raven.setUserContext({
      id: _user.uid,
      email: _user.email
    })
  }
})

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path='/' component={App} />
    </Router>
  </Provider>,
  document.getElementById('root'))
registerServiceWorker()
