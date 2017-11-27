import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Redirect,
  Link
} from 'react-router-dom'
import {
  Statistic,
  List,
  Divider,
  Button,
  Message
} from 'semantic-ui-react'
import { db, cloud } from './cloud'
import moment from 'moment'
import { formatNumber } from './utils/formatting'
import { calculateMoney, getPrice } from './utils/utils.js'
import './PorfoliosPage.css'

export const formatDate = (timestamp) => {
  const isToday = moment(timestamp).isSame(moment(), 'day')
  return isToday ? 'created today' : `created at ${moment(timestamp).format('ll')}`
}

export const PortfoliosNaviagation = ({portfolios, selectedUrl}) => {
  if (portfolios.items.length === 0) {
    return ''
  }
  const {items} = portfolios
  return (
    <List horizontal className='portfolios-navigation'>
      {items.map((portfolio, index) => (
        <List.Item key={index}>
          <List.Content
            className={selectedUrl === portfolio.url ? 'profile-link-active' : ''}>
            <List.Header>
              <Link to={`/portfolios/${portfolio.url}`}>
                {portfolio.name}
              </Link>
            </List.Header>
          </List.Content>
        </List.Item>
      ))}
    </List>
  )
}

export const PortfolioList = ({prices, data}) => {
  const sortedData = Object.keys(data)
    .map(symbol => {
      const price = getPrice(symbol, prices) * data[symbol]
      return [symbol, data[symbol], price]
    }).sort((a, b) => {
      return b[2] - a[2]
    })
  return (
    <div className='PortfolioList'>
      {sortedData.map((coin, index) => (
        <div className='PortfolioList-item' key={index}>
          <div>{coin[0]}</div>
          <div>{data[coin[0]].toFixed(8)}</div>
          <div>{formatNumber(getPrice(coin[0], prices) * data[coin[0]], 'USD')}</div>
        </div>
      ))}
    </div>
  )
}

export class PortfolioPage extends Component {
  render () {
    const {portfolios, prices, match} = this.props
    if (portfolios.items.length === 0) {
      return (
        <Redirect to={{
          pathname: '/invest',
          state: { from: '/portfolios' }
        }} />
      )
    }
    const selectedPortfolio = portfolios.items.find(el => {
      return el.url === match.params.name
    })
    if (this.props.location.pathname === '/portfolios' || !selectedPortfolio) {
      const nextUrl = `/portfolios/${portfolios.items[portfolios.selected].url}`
      return (
        <Redirect to={{
          pathname: nextUrl,
          state: {
            from: '/portfolios',
            portfolio: portfolios.items[portfolios.selected]
          }
        }} />
      )
    }
    const money = calculateMoney(selectedPortfolio.data, prices)
    return (
      <div className='portfolio-page'>
        <PortfoliosNaviagation
          selectedUrl={selectedPortfolio.url}
          portfolios={portfolios} />
        <br />
        {selectedPortfolio.hasOwnProperty('saved') && !selectedPortfolio.saved &&
          <Message
            className='portfolio-page-auth-message'
            attached='top'
            warning >
            <Message.Header>Unsaved</Message.Header>
            <Link to={'/login'}>
              Sign In
            </Link>
          </Message> }
        <Statistic
          label='Current money'
          value={formatNumber(money, 'USD')} />
        <Button
          circular
          basic
          color='red'
          icon='delete'
          className='deleteBtn'
          onClick={() => this.props.deletePortfolio(selectedPortfolio.url, selectedPortfolio.id)} />
        <Divider horizontal>
          {selectedPortfolio.createdAt
            ? formatDate(selectedPortfolio.createdAt)
            : 'created today'}
          {selectedPortfolio.firstMoney &&
            ` with ${formatNumber(selectedPortfolio.firstMoney, 'USD')}`}
        </Divider>
        <PortfolioList
          prices={prices}
          data={selectedPortfolio.data} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    portfolios: state.portfolios,
    prices: state.prices.items
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deletePortfolio: (url, id) => {
      const user = cloud.auth().currentUser
      if (user && id) {
        db.ref('portfolios').child(user.uid).child(id).remove()
      }
      dispatch({
        type: 'REMOVE_SELECTED_PORTFOLIO',
        url
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PortfolioPage)
