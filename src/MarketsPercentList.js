import React from 'react'
import { formatNumber } from './utils/formatting'

const getPercent = mPercent => mPercent[Object.keys(mPercent)[0]]

const getSymbol = mPercent => Object.keys(mPercent)[0]

const MarketsPercentList = ({data, money}) => {
  return (
    <div className='markets-percent-list'>
      <div className='markets-percent-list-inner'>
        {data.map((mPercent, index) => (
          <div className='markets-percent-list-row' key={index}>
            <div className='markets-percent-list-row-symbol'>
              {getSymbol(mPercent)} - {getPercent(mPercent)}%
            </div>
            <div className='markets-percent-list-row-value'>
              {money > 0 &&
                formatNumber((getPercent(mPercent) / 100 * money).toFixed(2), 'USD')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarketsPercentList
