import React from 'react'
import { connect } from 'react-redux'
import {
  NavLink as Link
} from 'react-router-dom'
import {
  compose,
  withState,
  withHandlers
} from 'recompose'
import {
  Button,
  Icon,
  Modal
} from 'semantic-ui-react'

import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import AssetList from './AssetList'
import SanfolioHeader from './Header'
import AssetAvatar from './AssetIcon'
import { formatNumber } from './utils/formatting'
import './Dashboard.css'

const propTypes = {
  prices: PropTypes.object.isRequired,
  portfolios: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingPrices: PropTypes.bool.isRequired,
  loadingRestPrices: PropTypes.bool.isRequired,
  retrieveAssetDetails: PropTypes.func.isRequired
}

const Dashboard = ({
  markets,
  history,
  prices,
  portfolios,
  loading,
  loadingPrices,
  loadingRestPrices,
  toggle,
  retrieveAssetDetails,
  assetDetail,
  isDetailToggled
}) => (
  <div>
    {loading || loadingRestPrices || loadingPrices
      ? <div>
        <Spinner name='line-scale' />
      </div>
      : <div className='app-inner'>
        <SanfolioHeader title='Top 20 assets by capitalization' />
        <AssetList
          markets={markets}
          history={history}
          handleAssetItemClicked={toggle}
          prices={prices} />
        {portfolios.length < 4 &&
        <Link className='app-btn-invest' to={'/invest'}>
          Invest money
        </Link>}
        <Modal
          open={isDetailToggled}
          onClose={toggle}
          basic
          size='small'
        >
          {assetDetail.isLoading
              ? <div>Loading...</div>
              : <div className='asset-detail'>
                <Modal.Header className='asset-detail-header'>
                  <AssetAvatar symbol={assetDetail.detail.symbol || 'BTC'} />
                  &nbsp;&nbsp;{assetDetail.detail.symbol}
                </Modal.Header>
                <Modal.Content>
                  <div className='asset-detail-item'>
                    <div className='asset-detail-item-row'>
                      <div className='asset-detail-item-row-title'>Rank</div>
                      <div className='asset-detail-item-row-body'>{assetDetail.detail.rank}</div>
                    </div>
                    <div className='asset-detail-item-row'>
                      <div className='asset-detail-item-row-title'>Price USD</div>
                      <div className='asset-detail-item-row-body'>{formatNumber(assetDetail.detail.price_usd, 'USD')}</div>
                    </div>
                    <div className='asset-detail-item-row'>
                      <div className='asset-detail-item-row-title'>Price BTC</div>
                      <div className='asset-detail-item-row-body'>{assetDetail.detail.price_btc}</div>
                    </div>
                    <div className='asset-detail-item-row'>
                      <div className='asset-detail-item-row-title'>Market Capitalization</div>
                      <div className='asset-detail-item-row-body'>{formatNumber(assetDetail.detail.market_cap_usd, 'USD')}</div>
                    </div>
                    <div className='asset-detail-item-row'>
                      <div className='asset-detail-item-row-title'>Change 24h</div>
                      <div className='asset-detail-item-row-body'>{assetDetail.detail.percent_change_24h}%</div>
                    </div>
                  </div>
                </Modal.Content>
              </div>
          }
          <Modal.Actions>
            <Button
              color='green'
              basic
              onClick={toggle}>
              <Icon name='checkmark' /> Got it!
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    }
  </div>
)

Dashboard.propTypes = propTypes

const mapStateToProps = state => {
  return {
    markets: state.markets.items,
    prices: state.prices.items,
    portfolios: state.portfolios.items,
    history: state.prices.history,
    loading: state.markets.isLoading,
    loadingPrices: state.prices.isLoading,
    loadingRestPrices: state.zerocoins.isLoading,
    assetDetail: state.assetDetail
  }
}

const mapDispatchToProps = dispatch => {
  return {
    retrieveAssetDetails: symbol => {
      dispatch({
        types: ['LOADING_ASSET_DETAILS', 'SUCCESS_ASSET_DETAILS', 'FAILED_ASSET_DETAILS'],
        payload: {
          client: 'marketCapClient',
          request: {
            url: `/tickers?symbol=${symbol}`
          }
        }
      })
    }
  }
}

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withState('isDetailToggled', 'setDetailToggle', false),
  withHandlers({
    toggle: props => title => {
      props.retrieveAssetDetails(title)
      props.setDetailToggle(!props.isDetailToggled)
    }
  })
)

export default enhance(Dashboard)
