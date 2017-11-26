import React from 'react'
import { connect } from 'react-redux'
import ReconnectingWebsocket from 'reconnecting-websocket'
import {
  pure,
  compose,
  lifecycle
} from 'recompose'
import {
  Route,
  Switch,
  Redirect,
  NavLink as Link
} from 'react-router-dom'
import IntentForm from './IntentForm'
import PortfolioPage from './PorfoliosPage'
import SettingsPage from './Settings'
import Login from './Login'
import Dashboard from './Dashboard'
import ErrorBoundary from './ErrorBoundary'
import './App.css'

const ProtectedRoute = ({
  user = {},
  component: Component,
  ...rest
}) => (
  <Route {...rest} render={props => (
    user.user && user.user.uid ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
    )
  )} />
)

export const App = ({
  user
}) => (
  <div className='wrapper'>
    <div className='app'>
      <div className='container'>
        <ErrorBoundary>
          <Switch>
            <ProtectedRoute user={user} exact path={'/invest'} component={IntentForm} />
            <ProtectedRoute user={user} exact path='/portfolios' component={PortfolioPage} />
            <ProtectedRoute user={user} path={'/portfolios/:name'} component={PortfolioPage} />
            <ProtectedRoute user={user} exact path={'/settings'} component={SettingsPage} />
            <Route path={'/login'} component={Login} />
            <Route exact path={'/'} component={Dashboard} />
          </Switch>
        </ErrorBoundary>
      </div>
      <div className='menu'>
        <Link
          className='menu-link'
          activeClassName='menu-link-active'
          to='/settings'>
          Settings
        </Link>
        <Link
          className='menu-link'
          activeClassName='menu-link-active'
          exact
          to='/'>
          Dashboard
        </Link>
        <Link
          className='menu-link'
          activeClassName='menu-link-active'
          to='/portfolios'>
          My folio
        </Link>
      </div>
    </div>
  </div>
)

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const WS_URL = 'wss://api.lionshare.capital'

const connectToWebsocket = dispatch => {
  this.websocket = new ReconnectingWebsocket(WS_URL, [], {})
  this.websocket.addEventListener('message', message => {
    const data = JSON.parse(message.data)
    const title = data.cryptoCurrency
    const price = parseFloat(data.price)
    dispatch({
      type: 'FIRE_TICKET',
      title,
      price
    })
  })
}

const mapDispatchToProps = dispatch => {
  return {
    retrievePrices: () => {
      dispatch({
        types: ['LOADING_PRICES', 'SUCCESS_PRICES', 'FAILED_PRICES'],
        payload: {
          client: 'lionClient',
          request: {
            url: '/prices'
          }
        }
      })
    },
    retrieveMarkets: () => {
      dispatch({
        types: ['LOADING_MARKETS', 'SUCCESS_MARKETS', 'FAILED_MARKETS'],
        payload: {
          client: 'lionClient',
          request: {
            url: '/markets'
          }
        }
      })
    },
    retrieveZeroCoins: () => {
      dispatch({
        types: ['LOADING_ZEROCOINS', 'SUCCESS_ZEROCOINS', 'FAILED_ZEROCOINS'],
        payload: {
          client: 'marketCapClient',
          request: {
            url: '/prices'
          }
        }
      })
    },
    retrieveHistoryData: () => {
      dispatch({
        types: ['LOADING_HISTORY_DATA', 'SUCCESS_HISTORY_DATA', 'FAILED_HISTORY_DATA'],
        payload: {
          client: 'marketCapClient',
          request: {
            url: '/history'
          }
        }
      })
    },
    realtimeUpdates: () => {
      connectToWebsocket(dispatch)
    }
  }
}

const enhance = compose(
  pure,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  lifecycle({
    componentDidMount () {
      this.props.retrievePrices()
      this.props.retrieveMarkets()
      this.props.retrieveZeroCoins()
      this.props.retrieveHistoryData()
      this.props.realtimeUpdates()
    }
  })
)

export default enhance(App)
