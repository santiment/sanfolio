/* eslint-env jasmine */
import { searchPriceCoinBySymbol } from './../MarketsPercentList.js'
import { calculateMoney, getPrice } from './../utils/utils.js'

it('get price of coin by symbol', () => {
  const prices = [
    {'BTC': 56.60},
    {'ETH': 20.00},
    {'ETC': 12.12}
  ]
  const coinPrice = searchPriceCoinBySymbol('ETH', prices)
  expect(coinPrice).toEqual(20.00)
})

it('get price of coin from static and live data', () => {
  const prices = {
    'BTC': [5000],
    'ETH': [303],
    'ETC': [120]
  }
  const live = {
    'BTC': 6000
  }
  const price = getPrice('ETH', prices, live)
  expect(price).toEqual(303)
})

it('get calculated money of portfolio', () => {
  const prices = {
    'BTC': [5000],
    'ETH': [303],
    'ETC': [120]
  }
  const data = {
    'BTC': 0.028,
    'ETH': 10,
    'ETC': 11
  }
  const live = {
    'BTC': 6000
  }
  const money = calculateMoney(data, prices, live)
  expect(money).toEqual(6000 * 0.028 + 303 * 10 + 120 * 11)
})
