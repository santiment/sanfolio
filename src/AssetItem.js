import React from 'react'
import PropTypes from 'prop-types'
import {
  pure,
  compose,
  lifecycle,
  withState
} from 'recompose'
import { Line } from 'react-chartjs-2'
import moment from 'moment'
import AssetAvatar from './AssetIcon'
import './AssetItem.css'
import { formatNumber } from './utils/formatting'

const getChartDataFromHistory = (history = []) => {
  return {
    labels: ['', '', '', '', '', '', '', '', '', '', '', 'today']
      .map((el, index, arr) => {
        return moment().subtract(arr.length - 1 - index, 'days').format('DD MMM')
      }),
    datasets: [{
      fill: false,
      data: history ? history.slice(0, 12).map(dayData => {
        return dayData > 1 ? dayData.toFixed(2) : dayData.toFixed(8)
      }) : []
    }]
  }
}

const propTypes = {
  asset: PropTypes.shape({
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    cap: PropTypes.number.isRequired,
    history: PropTypes.array
  })
}

const AssetItem = ({
  asset,
  flash,
  handleClicked
}) => {
  const chartData = getChartDataFromHistory(asset.history)
  const chartOptions = {
    responsive: true,
    showTooltips: false,
    pointDot: false,
    scaleShowLabels: false,
    datasetFill: false,
    scaleFontSize: 0,
    animation: {
      easing: 'easeOutQuart'
    },
    legend: {
      display: false
    },
    tooltips: {
      callbacks: {
        label: tooltipItem => {
          return tooltipItem.yLabel
        }
      }
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 5
      }
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
        ticks: {
          display: false
        },
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
    <div
      className='assets-item'
      onClick={handleClicked} >
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
            height={60}
            width={155}
            data={chartData}
            options={chartOptions}
            style={{ transition: 'opacity 0.25s ease' }}
          />
          : <div>---</div>}
      </div>
    </div>
  )
}

AssetItem.propTypes = propTypes

const enhance = compose(
  pure,
  withState('flash', '_', false),
  lifecycle({
    componentWillReceiveProps (newProps) {
      if (this.props.asset.price !== newProps.asset.price) {
        this.setState({flash: true})
      }
      this.timer = setTimeout(() => {
        this.timer && this.setState({flash: false})
      }, 1000)
    },
    componentWillUnmount () {
      clearTimeout(this.timer)
      this.timer = false
    }
  })
)

export default enhance(AssetItem)
