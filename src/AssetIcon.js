import React from 'react'
import PropTypes from 'prop-types'

const assets = {
  MIOTA: {
    x: 126,
    y: 16
  },
  QTUM: {
    x: 80,
    y: 0
  },
  HSR: {
    x: 126,
    y: 64,
    width: 16,
    height: 14
  },
  XLM: {
    x: 174,
    y: 76,
    width: 15,
    height: 15
  },
  ADA: {
    x: 16,
    y: 128
  }
}

const Icon = props => {
  if (Object.keys(assets).includes(props.symbol)) {
    const assetStyle = assets[props.symbol]
    const styles = {
      backgroundImage: `url(${props.sprite})`,
      backgroundPosition: `${assetStyle.x * (-1)}px ${assetStyle.y * (-1)}px`,
      width: assetStyle.width ? assetStyle.width : props.size,
      height: assetStyle.height ? assetStyle.height : props.size,
      marginRight: 5
    }
    return (
      <div style={styles} />
    )
  }
  return (
    <i className={`assets-item-avatar cc ${props.symbol}`} />
  )
}

Icon.propTypes = {
  size: PropTypes.number,
  symbol: PropTypes.string.isRequired,
  sprite: PropTypes.string.isRequired
}

Icon.defaultProps = {
  sprite: require('./assets/logos.png'),
  size: 16
}

export default Icon
