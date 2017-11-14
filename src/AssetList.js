import React from 'react'
import AssetItem from './AssetItem'

const AssetList = ({markets, prices}) => (
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
            price: prices && prices[title] ? prices[title][0] : null,
            cap: markets[title]
          }} />
    ))}
  </div>
)

export default AssetList
