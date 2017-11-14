import React from 'react'
import { connect } from 'react-redux'
import {
  pure,
  compose,
  lifecycle
} from 'recompose'
import AssetList from './AssetList'
import './App.css'

export const App = ({markets, loading, hasError, loadingPrices, prices}) => (
  <div className='wrapper'>
    <div className='app'>
      {loading
        ? <div>
            loading...
          </div>
        : <div className='app-inner'>
          <AssetList
            markets={markets}
            prices={prices} />
          <a href='#' className='app-btn-invest'>
            Invest money
          </a>
        </div>
      }
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
