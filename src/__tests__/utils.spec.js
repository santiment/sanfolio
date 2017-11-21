/* eslint-env jasmine */
import {
  calculateMoney,
  getPrice,
  selectBalancedData
} from './../utils/utils.js'

it('get price of coin by symbol', () => {
  const prices = {
    'BTC': 56.60,
    'ETH': 20.00,
    'ETC': 12.12
  }
  const coinPrice = getPrice('ETH', prices)
  expect(coinPrice).toEqual(20.00)
})

it('make balanced market portfilio', () => {
  const prices = {
    'BTC': 7000,
    'ETH': 300.00,
    'ETC': 200.12
  }
  const markets = [{BTC: '60.15'}, {ETH: '15.48'}, {ETC: '1.61'}]
  const balanced = selectBalancedData(100, prices, markets)
  expect(balanced).toMatchSnapshot()
})

it('get calculated money of portfolio', () => {
  const prices = {
    'BTC': 6000,
    'ETH': 303,
    'ETC': 120
  }
  const data = {
    'BTC': 0.028,
    'ETH': 10,
    'ETC': 11
  }
  const money = calculateMoney(data, prices)
  expect(money).toEqual(6000 * 0.028 + 303 * 10 + 120 * 11)
})
