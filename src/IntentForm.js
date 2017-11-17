import React, { Component } from 'react'
import { connect } from 'react-redux'
import slug from 'slug'
import {
  Button,
  Input,
  Statistic,
  Message,
  Icon,
  Modal,
  Header,
  Label
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
  );  
}

class IntentAmount extends Component {

  state = {
    rawAmount: 0,
    openSuggestion: false,
    chooseProfileName: false,
    newPortfolioName: 'Portfolio 1',
    completed: false,
    errorNameIsNotUnique: false,
    errorNameLength: false
  }

  handleChangeMoney = e => {
    this.setState({rawAmount: e.target.value})
  }

  handleSubmitMoney = e => {
    this.props.onSubmitMoney(this.state.rawAmount)
    this.setState({rawAmount: 0})
  }

  handleChangeNewPortfolioName = e => {
    const name = e.target.value
    this.setState({
      newPortfolioName: name,
      errorNameLength: !(name.length > 0 && name.length <= 15)
    })
  }

  handleChoosePortfolioName = e => {
      // TODO:
      // check > 3
      // check slug is unique
    const portfolioName = this.state.newPortfolioName
    const url = slug(portfolioName, {lower: true})
    const isUniqueName = ((portfolios) => {
      let acc = true
      for (let el of portfolios) {
        acc = el.url !== url
        if (acc === false)
          return
      }
      return acc
    })(this.props.portfolios.items)
    
    if (isUniqueName) {
      this.props.createPortfolio(
        portfolioName,
        this.props.marketsPercentsList,
        this.props.money,
        url
      )
      this.setState({completed: true})  
    } else {
      this.setState({errorNameIsNotUnique: true})
    }
  }

  render() {
    const {money, marketsPercentsList, portfolios} = this.props
    if (this.state.completed) {
      const nextUrl = `/portfolios/${portfolios.items[portfolios.selected].url}`
      return (
        <Redirect to={{
          pathname: nextUrl,
          state: { from: this.props.location }
        }} />
      )
    }
    return (
      <div className='IntentForm'>
        <Statistic 
          label='Current money'
          value={formatNumber(money, 'USD')} />

        {money === 0 &&
        <Message>
          <Message.Header>
            How much money you wish to invest in the crypto world?
          </Message.Header>
          <br />
          <Input 
            type='number'
            onChange={this.handleChangeMoney}
            className='input-money'
            value={this.state.rawAmount} />
          <Button 
            basic
            color='green'
            onClick={this.handleSubmitMoney}>
            Calculate
          </Button>
        </Message>}

        {money > 0 &&
          <div className='suggestion-form'>
            <Message
              floating
              header='Suggestion'
              content='We suggeset you, this balanced portfolio.'
            />
            <MarketsPercentList data={marketsPercentsList} money={money} />
            <br />
            <Button 
              onClick={() => this.setState({chooseProfileName: true})}
              color='green'>
              Confirm balanced investing schema
            </Button>
          </div>
        }

        <Modal
          open={this.state.chooseProfileName}
          onClose={() => this.setState({chooseProfileName: false})}
          basic
          size='small'
        >
          <Header icon='browser' content='Change the Portfolio name' />
          <Modal.Content>
            <Input
              type='text'
              ref='portfolioNameInput'
              onChange={this.handleChangeNewPortfolioName}
              value={this.state.newPortfolioName} />
            {this.state.errorNameIsNotUnique &&
              <Label 
                basic
                color='red'
                pointing>
                Please enter a unique name of new portfolio
              </Label>}
            {this.state.errorNameLength && 
              <Label 
                basic
                color='red'
                pointing>
                Please enter a name with length &le; 15
              </Label>}
          </Modal.Content>
          <Modal.Actions>
            <Button 
              color='green'
              onClick={this.handleChoosePortfolioName} inverted>
              <Icon name='checkmark' /> Create
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const getTop20keys = Object.keys(state.markets.items)
      .filter((symbol, index) => index < 20)
  const totalMarketCap = getTop20keys
      .map(symbol => {
        return state.markets.items[symbol]
      })
      .reduce((acc, ell) => {
        return acc += ell 
      }, 0)
  const getPercentOfMarket = (cap, totalMarketCap) => {
    return (cap / totalMarketCap * 100).toFixed(2)
  }
  const marketsPercentsList = getTop20keys
    .map(symbol => {
      return {[symbol]: 
        getPercentOfMarket(state.markets.items[symbol], totalMarketCap)}
    })
  return {
    totalMarketCap,
    marketsPercentsList,
    money: state.intentForm.money,
    portfolios: state.portfolios
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmitMoney: money => {
      dispatch({
        type: 'INPUT_AMOUNT_MONEY',
        money
      })
    },
    createPortfolio: (name, items, money, url) => {
      dispatch({
        type: 'CREATE_NEW_PORTFOLIO',
        name,
        items,
        money,
        url
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntentAmount);
