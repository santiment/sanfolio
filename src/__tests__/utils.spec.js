/* eslint-env jasmine */
import { searchPriceCoinBySymbol } from './../MarketsPercentList.js'

it('get price of coin by symbol', () => {
  const prices = [
    {'BTC': 56.60},
    {'ETH': 20.00},
    {'ETC': 12.12}
  ]
  const coinPrice = searchPriceCoinBySymbol('ETH', prices)
  expect(coinPrice).toEqual(20.00)
})
