import React from 'react'
import { Line } from 'react-chartjs-2'
import './AssetItem.css'
import { formatNumber } from './utils/formatting'

const COLOR = '#FF7300'

const AssetAvatar = ({symbol}) => {
  return (
    <div
      className='assets-item-avatar'
      style={{backgroundColor: COLOR}}
     />
  )
}

const getChartDataFromHistory = (history = []) => {
  return {
    labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
    datasets: [{
      strokeColor: COLOR,
      data: history ? history.slice(0, 12) : []
    }]
  }
}

const AssetItem = ({asset}) => {
  const chartData = getChartDataFromHistory(asset.history)
  const chartOptions = {
    responsive: true,
    showTooltips: false,
    pointDot: false,
    scaleShowLabels: false,
    datasetFill: false,
    scaleFontSize: 0,
    animation: false,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          display: false
        },
        gridLines: {
          drawBorder: false,
          display: false
        }
      }],
      xAxes: [{
        gridLines: {
          drawBorder: false,
          display: false
        }
      }]
    }
  }
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
        {asset.history
          ? <Line
            height={70}
            width={150}
            data={chartData}
            options={chartOptions}
            style={{ transition: 'opacity 0.25s ease' }}
            redraw
          />
          : <div>---</div>}
      </div>
    </div>
  )
}

export default AssetItem
