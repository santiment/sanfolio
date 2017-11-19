import React from 'react'
import { connect } from 'react-redux'
import {
  Button
} from 'semantic-ui-react'
import {
  pure,
  compose,
  lifecycle,
  withState
} from 'recompose'
import { formatNumber } from './utils/formatting'

const getPercent = mPercent => mPercent[Object.keys(mPercent)[0]]

const getSymbol = mPercent => Object.keys(mPercent)[0]

export const searchPriceCoinBySymbol = (symbol, prices) => {
  const price = prices.find(price => {
    return Object.keys(price)[0] === symbol
  })
  if (!price) {
    // TODO: we don't have all prices for top 20 market cap!
    // return 1 for this. IT's critical place!
    return 1
  }
  return Object.values(price)[0]
}

export const AssetRow = ({
  cap,
  money,
  prices
}) => {
  const symbol = getSymbol(cap)
  const coinMoney = getPercent(cap) / 100 * money
  const coin = coinMoney / searchPriceCoinBySymbol(symbol, prices)
  return (
    <div className='markets-percent-list-row'>
      <div className='markets-percent-list-row-symbol'>
        {getSymbol(cap)} - {getPercent(cap)}%
      </div>
      <div className='markets-percent-list-coin-value'>
        {coin.toFixed(8)}
      </div>
      <div className='markets-percent-list-row-value'>
        {money > 0 && formatNumber((coinMoney).toFixed(2), 'USD')}
      </div>
    </div>
  )
}

export const MarketsPercentList = ({
  markets,
  money,
  prices,
  onListApproved,
  onListDeclined,
  data
}) => {
  return (
    <div className='markets-percent-list'>
      <div className='markets-percent-list-inner'>
        {markets.map((cap, index) => (
          <AssetRow
            key={index}
            money={money}
            prices={prices}
            cap={cap} />
        ))}
      </div>
      <div className='markets-percent-list-control'>
        <Button
          onClick={onListDeclined}
          basic
          color='red'>
          Reset
        </Button>
        <Button
          onClick={() => onListApproved(data)}
          color='green'>
          Confirm balanced investing schema
        </Button>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  const prices = Object.keys(state.prices.items).map(key => {
    return {
      [key]: state.prices.items[key][0]
    }
  })
  return {
    prices
  }
}

const enhance = compose(
  pure,
  withState('data', '_', {}),
  connect(
    mapStateToProps
  ),
  lifecycle({
    componentDidMount () {
      const {
        markets,
        money,
        prices
      } = this.props
      const data = markets.map((cap, index) => {
        const symbol = getSymbol(cap)
        const coinMoney = getPercent(cap) / 100 * money
        const coin = coinMoney / searchPriceCoinBySymbol(symbol, prices)
        return {
          [symbol]: coin
        }
      }).reduce((acc, val, index) => {
        acc[Object.keys(val)[0]] = Object.values(val)[0]
        return acc
      }, {})
      this.setState({data})
    }
  })
)

export default enhance(MarketsPercentList)
