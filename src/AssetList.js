import React from 'react'
import AssetItem from './AssetItem'

const AssetList = ({markets}) => (
  <div className='assets-list'>
    {Object.keys(markets)
      .filter((key, index) => index < 20)
      .map((title, index) => (
        <AssetItem
          key={index}
          asset={{
            title,
            index,
            cap: markets[title]
          }} />
    ))}
  </div>
)

export default AssetList
