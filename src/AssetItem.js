import React from 'react'
import './AssetItem.css'
import { formatNumber } from './utils/formatting'

const AssetAvatar = ({symbol}) => {
  return (
    <div
      className='assets-item-avatar'
      style={{backgroundColor: '#FF7300'}}
     />
  )
}

const AssetItem = ({asset}) => {
  return (
    <div className='assets-item'>
      <div className='assets-item-title'>
        <AssetAvatar symbol={asset.title} />
        <strong>{asset.title}</strong>
      </div>
      <div className='assets-item-details'>
        {asset.price
          ? <div className='assets-item-details-price'>{formatNumber(asset.price, 'USD')}</div>
          : <div className='assets-item-details-price'>---</div>}
        <div className='assets-item-details-cap'>{formatNumber(asset.cap, 'USD')}</div>
      </div>
      <div className='assets-item-graph'>
        graph;)
      </div>
    </div>
  )
}

export default AssetItem
