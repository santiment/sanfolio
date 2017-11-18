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
  NavLink as Link
} from 'react-router-dom'
import AssetList from './AssetList'
import IntentForm from './IntentForm'
import PortfolioPage from './PorfoliosPage'
import './App.css'

export const App = ({markets, loading, hasError, loadingPrices, prices, live}) => (
  <div className='wrapper'>
    <div className='app'>
      <div className='container'>
        <Switch>
          <Route exact path={'/invest'} render={() => (
            <IntentForm />
          )} />
          <Route exact path='/portfolios' component={PortfolioPage} />
          <Route path={'/portfolios/:name'} component={PortfolioPage} />
          <Route exact path={'/'} render={() => (
            <div>
              {loading
                ? <div>
                    loading...
                  </div>
                : <div className='app-inner'>
                  <AssetList
                    markets={markets}
                    prices={prices}
                    live={live} />
                  <Link className='app-btn-invest' to={'/invest'}>
                    Invest money
                  </Link>
                </div>
              }
            </div>
          )} />
        </Switch>
      </div>
      <div className='menu'>
        <Link
          className='menu-link'
          activeClassName='menu-link-active'
          to='settings'>
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
          to='portfolios'>
          My folio
        </Link>
      </div>
    </div>
  </div>
)

const mapStateToProps = state => {
  return {
    markets: state.markets.items,
    loading: state.markets.isLoading,
    hasError: state.markets.error,
    loadingPrices: state.prices.isLoading,
    prices: state.prices.items,
    live: state.prices.live
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
          request: {
            url: '/markets'
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
      this.props.realtimeUpdates()
    }
  })
)

export default enhance(App)
