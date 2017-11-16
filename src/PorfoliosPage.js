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
import './IntentForm.css'

export const PortfoliosNaviagation = ({portfolios}) => {
  if (portfolios.items.length === 0) {
    return ''
  }
  const {selected, items} = portfolios
  return (
    <List horizontal>
      {items.map((portfolio, index) => (
        <List.Item key={index}>
          <List.Content
            className={selected === index ? 'profile-link-active' : ''}>
            <List.Header>
              <Link to={`/portfolios/${portfolio.name}`}>
                {portfolio.name}
              </Link>
            </List.Header>
          </List.Content>
        </List.Item>
      ))}
    </List>
  )
}

export class PortfolioPage extends Component {
  render () {
    console.log('check', this.props.match);
    const {portfolios} = this.props
    if (portfolios.items.length === 0) {
      return (
        <Redirect to={{
          pathname: '/invest',
          state: { from: '/portfolios' }
        }} />
      )
    }
    const selectedPortfolio = portfolios.items[0]
    return (
      <div className='PortfolioPage'>
        <h3>Name: {this.props.match.params.name}</h3>
        <PortfoliosNaviagation portfolios={portfolios} />
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
