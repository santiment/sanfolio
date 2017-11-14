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

// FIXME:
const PRICE = 6500

const AssetItem = ({asset}) => {
  return (
    <div className='assets-item'>
      <div className='assets-item-title'>
        <AssetAvatar symbol={asset.title} />
        <strong>{asset.title}</strong>
      </div>
      <div className='assets-item-details'>
        <div className='assets-item-details-price'>{formatNumber(PRICE, 'USD')}</div>
        <div className='assets-item-details-cap'>{formatNumber(asset.cap, 'USD')}</div>
      </div>
      <div className='assets-item-graph'>
        graph;)
      </div>
    </div>
  )
}

export default AssetItem
