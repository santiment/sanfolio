import React from 'react'
import {
  pure,
  compose,
  lifecycle,
  withState
} from 'recompose'
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

const AssetItem = ({asset, flash}) => {
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
  const priceClsName = flash
    ? 'assets-item-details-price asset-item-details-price-flash'
    : 'assets-item-details-price'
  return (
    <div className='assets-item'>
      <div className='assets-item-title'>
        <AssetAvatar symbol={asset.title} />
        <strong>{asset.title}</strong>
      </div>
      <div className='assets-item-details'>
        {asset.price
          ? <div className={priceClsName}>{formatNumber(asset.price, 'USD')}</div>
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

const enhance = compose(
  pure,
  withState('flash', '_', false),
  lifecycle({
    componentWillReceiveProps (newProps) {
      if (this.props.asset.price !== newProps.asset.price) {
        this.setState({flash: true})
      }
      this.timer = setTimeout(() => {
        this.setState({flash: false})
      }, 1000)
    },
    componentWillUnmount () {
      clearTimeout(this.timer)
    }
  })
)

export default enhance(AssetItem)
