import React from 'react'
import { getPrice } from './utils/utils.js'
import AssetItem from './AssetItem'

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
