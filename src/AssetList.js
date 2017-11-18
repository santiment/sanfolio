import React from 'react'
import AssetItem from './AssetItem'

const getPrice = (title, prices, live) => {
  if (live && live[title]) {
    return live[title]
  } else if (prices && prices[title]) {
    return prices[title][0]
  }
  return null
}

const AssetList = ({markets, prices, live}) => (
  <div className='assets-list'>
    {Object.keys(markets)
      .filter((key, index) => index < 20)
      .map((title, index) => (
        <AssetItem
          key={index}
          asset={{
            title,
            index,
            history: prices && prices[title] ? prices[title] : null,
            price: getPrice(title, prices, live),
            cap: markets[title]
          }} />
    ))}
  </div>
)

export default AssetList
