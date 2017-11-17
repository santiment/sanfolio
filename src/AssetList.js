import React from 'react'
import AssetItem from './AssetItem'

const getPrice = (title, prices, life) => {
  if (life && life[title]) {
    return life[title]
  } else if (prices && prices[title]) {
    return prices[title][0]
  }
  return null
}

const AssetList = ({markets, prices, life}) => (
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
            price: getPrice(title, prices, life),
            cap: markets[title]
          }} />
    ))}
  </div>
)

export default AssetList
