import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'
import thunk from 'redux-thunk'
import { cloud } from './cloud'
import './index.css'
import App from './App'
import reducers from './rootReducers.js'
import registerServiceWorker from './registerServiceWorker'

const client = axios.create({
  baseURL: 'https://api.lionshare.capital/api',
  responseType: 'json'
})

const middleware = [axiosMiddleware(client), thunk]

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
