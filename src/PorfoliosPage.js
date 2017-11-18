import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Redirect,
  Link
} from 'react-router-dom'
import {
  Statistic,
  List
} from 'semantic-ui-react'
import { formatNumber } from './utils/formatting'
import './PorfoliosPage.css'

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

export const PortfolioList = ({data}) => {
  return (
    <div>
      {Object.keys(data).map((coinKey, index) => (
        <div key={index}>{coinKey} - {data[coinKey].toFixed(8)}</div>
      ))}
    </div>
  )
}

export class PortfolioPage extends Component {
  render () {
    const {portfolios, match} = this.props
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
    return (
      <div className='portfolio-page'>
        <PortfoliosNaviagation
          selectedUrl={selectedPortfolio.url}
          portfolios={portfolios} />
        <br />
        <Statistic
          label='Current money'
          value={formatNumber(selectedPortfolio.money, 'USD')} />
        <PortfolioList data={selectedPortfolio.data} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    portfolios: state.portfolios
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectPortfolioById: selected => {
      dispatch({
        type: 'SELECT_PORTFOLIO',
        selected
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PortfolioPage)
