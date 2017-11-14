import React from 'react'
import { connect } from 'react-redux'
import {
  pure,
  compose,
  lifecycle
} from 'recompose'
import {
  Route,
  //Link,
  NavLink as Link
} from 'react-router-dom'
import AssetList from './AssetList'
import IntentForm from './IntentForm'
import './App.css'

export const App = ({markets, loading, hasError, loadingPrices, prices}) => (
  <div className='wrapper'>
    <div className='app'>
      <div className='container'>
        <Route exact path={'/invest'} render={() => (
          <IntentForm />
        )} />
        <Route exact path={'/'} render={() => (
          <div>
            {loading
              ? <div>
                  loading...
                </div>
              : <div className='app-inner'>
                <AssetList
                  markets={markets}
                  prices={prices} />
                <Link className='app-btn-invest' to={'/invest'}>
                  Invest money
                </Link>
              </div>
            }
          </div>
        )} />
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
          to='invest'>
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
    prices: state.prices.items
  }
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
    }
  })
)

export default enhance(App)
