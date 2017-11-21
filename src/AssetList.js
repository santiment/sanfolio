import React from 'react'
import AssetItem from './AssetItem'

const AssetList = ({markets, prices, history}) => (
  <div className='assets-list'>
    {Object.keys(markets)
      .filter((key, index) => index < 20)
      .map((title, index) => (
        <AssetItem
          key={index}
          asset={{
            title,
            history: history && history[title] ? history[title] : null,
            price: prices[title],
            cap: markets[title]
          }} />
    ))}
  </div>
)

export default AssetList
