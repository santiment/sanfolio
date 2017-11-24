import React from 'react'
import AssetItem from './AssetItem'

const AssetList = ({
  markets,
  prices,
  history,
  handleAssetItemClicked
}) => (
  <div className='assets-list'>
    {Object.keys(markets)
      .filter((key, index) => index < 20)
      .map((title, index) => (
        <AssetItem
          key={index}
          handleClicked={() => handleAssetItemClicked(title)}
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
