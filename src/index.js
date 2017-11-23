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
    db.ref('portfolios').child(user.uid).once('value', (snapshot) => {
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
})

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path='/' component={App} />
    </Router>
  </Provider>,
  document.getElementById('root'))
registerServiceWorker()
