import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'
import './index.css'
import App from './App'
import reducers from './rootReducers.js'
import registerServiceWorker from './registerServiceWorker'

const client = axios.create({
  baseURL: 'https://api.lionshare.capital/api',
  responseType: 'json'
})

const middleware = [axiosMiddleware(client)]

const store = createStore(reducers,
  composeWithDevTools(applyMiddleware(...middleware))
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))
registerServiceWorker()
