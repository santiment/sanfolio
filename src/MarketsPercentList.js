import React from 'react'
import { connect } from 'react-redux'
import {
  Button
} from 'semantic-ui-react'
import {
  pure,
  compose
} from 'recompose'
import { formatNumber } from './utils/formatting'
import {
  getPrice,
  selectBalancedData,
  getPercent,
  getSymbol
} from './utils/utils'

export const AssetRow = ({
  cap,
  money,
  data,
  prices
}) => {
  const symbol = getSymbol(cap)
  return (
    <div className='markets-percent-list-row'>
      <div className='markets-percent-list-row-symbol'>
        {symbol} - {getPercent(cap)}%
      </div>
      <div className='markets-percent-list-coin-value'>
        {data[symbol].toFixed(8)}
      </div>
      <div className='markets-percent-list-row-value'>
        {formatNumber(getPrice(symbol, prices) * data[symbol], 'USD')}
      </div>
    </div>
  )
}

export const MarketsPercentList = ({
  markets,
  prices,
  data,
  onListApproved,
  onListDeclined
}) => {
  return (
    <div className='markets-percent-list'>
      <div className='markets-percent-list-inner'>
        {markets.map((cap, index) => (
          <AssetRow
            key={index}
            cap={cap}
            data={data}
            prices={prices} />
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

const mapStateToProps = (state, ownProps) => {
  const money = state.intentForm.money
  const prices = state.prices.items
  const markets = ownProps.markets
  return {
    prices,
    data: selectBalancedData(money, prices, markets)
  }
}

const enhance = compose(
  pure,
  connect(
    mapStateToProps
  )
)

export default enhance(MarketsPercentList)
