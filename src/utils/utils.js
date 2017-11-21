export const getPercent = mPercent => mPercent[Object.keys(mPercent)[0]]

export const getSymbol = mPercent => Object.keys(mPercent)[0]

export const selectBalancedData = (money, prices, markets) => {
  return markets.map((cap, index) => {
    const symbol = getSymbol(cap)
    const coinMoney = getPercent(cap) / 100 * money
    const coin = coinMoney / getPrice(symbol, prices)
    return {
      [symbol]: coin
    }
  }).reduce((acc, val, index) => {
    acc[Object.keys(val)[0]] = Object.values(val)[0]
    return acc
  }, {})
}

export const getPrice = (title, prices) => {
  if (prices && prices[title]) {
    return prices[title]
  }
  return null
}

export const calculateMoney = (data, prices) => {
  return Object.keys(data).reduce((acc, key) => {
    const coinValue = data[key]
    const coinPrice = prices[key]
    acc += coinValue * coinPrice
    return acc
  }, 0)
}
