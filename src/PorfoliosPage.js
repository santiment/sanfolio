import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Input,
  Statistic,
  List,
  Message
} from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { formatNumber } from './utils/formatting'
import './IntentForm.css'

const MarketsPercentList = ({data, money}) => {
  const getPercent = mPercent => mPercent[Object.keys(mPercent)[0]]
  const getSymbol = mPercent => Object.keys(mPercent)[0]
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

const ProfileList = (name = 'Portfolio 1') => (
  <List horizontal>
    <List.Item>
      <List.Content className='profile-link-active'>
        <List.Header>
          Portfolio 1
        </List.Header>
      </List.Content>
    </List.Item>
  </List>
)

class PortfolioPage extends Component {
  render () {
    const {portfolios} = this.props
    if (Object.keys(portfolios).length === 0) {
      return (
        <Redirect to={{
          pathname: '/invest',
          state: { from: this.props.location }
        }} />
      )
    }
    const selectedPortfolio = Object.values(portfolios.items[0])[0]
    return (
      <div className='IntentForm'>
        <ProfileList />
        <br />
        <Statistic
          label='Current money'
          value={formatNumber(selectedPortfolio.money, 'USD')} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    portfolios: state.portfolios
  }
}

export default connect(
  mapStateToProps
)(PortfolioPage)
