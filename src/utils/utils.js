export const getPrice = (title, prices, live) => {
  if (live && live[title]) {
    return live[title]
  } else if (prices && prices[title]) {
    return prices[title][0]
  }
  return null
}

export const calculateMoney = (data, prices, live) => {
  return Object.keys(data).reduce((acc, key) => {
    const coinValue = data[key]
    // TODO: || 1, hack if we don't have price data. Fix it. Critical!
    const coinPrice = getPrice(key, prices, live) || 1
    acc += coinValue * coinPrice
    return acc
  }, 0)
}
