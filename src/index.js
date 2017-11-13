import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import './index.css'
import App from './App'
import reducers from './rootReducers.js'
import registerServiceWorker from './registerServiceWorker'
import preloadedState from './marketsStub'

const middleware = []

const store = createStore(reducers,
  preloadedState,
  composeWithDevTools(applyMiddleware(...middleware))
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))
registerServiceWorker()
