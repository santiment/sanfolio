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
import { db, cloud } from './cloud';
import { Redirect } from 'react-router-dom'
import { formatNumber } from './utils/formatting'
import MarketsPercentList from './MarketsPercentList';
import './IntentForm.css'

export const calculateAmountOfCoins = (percentList, money) => {
  return percentList.map(coinPercent => {
    const coin = Object.values(coinPercent)[0] * money
    return {
      [Object.keys(coinPercent)[0]]: coin
    } 
  })
}

class IntentAmount extends Component {

  state = {
    money: 0,
    openSuggestion: false,
    chooseProfileName: false,
    newPortfolioName: 'Portfolio 1',
    completed: false,
    errorNameIsNotUnique: false,
    errorNameLength: false,
    portfolioData: {}
  }

  handleChangeMoney = e => {
    this.setState({money: e.target.value})
  }

  handleSubmitMoney = e => {
    this.props.onSubmitMoney(this.state.money)
    this.setState({money: 0})
  }

  handleChangeNewPortfolioName = e => {
    const name = e.target.value
    this.setState({
      newPortfolioName: name,
      errorNameLength: !(name.length > 0 && name.length <= 15),
      errorNameIsNotUnique: false
    })
  }

  handleChoosePortfolioName = e => {
      // TODO:
      // check > 3
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
        this.state.portfolioData,
        this.props.money,
        url
      )
      this.setState({completed: true})  
    } else {
      this.setState({errorNameIsNotUnique: true})
    }
  }

  handleListApproved = portfolioData => {
    this.setState({
      portfolioData,
      chooseProfileName: true
    })
  }

  handleListDeclined = e => {
    this.props.onSubmitMoney(0)
    this.setState({money: 0})
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
        {money !== 0 &&
        <Statistic 
          label='Current money'
          value={formatNumber(money, 'USD')} />}

        {money === 0 &&
        <Message>
          <Message.Header>
            Create a new portfolio
          </Message.Header>
          <p>Enter below the amount in US Dollars that 
            you wish to create a diversified portfolio for.</p>
          <Input 
            type='number'
            onChange={this.handleChangeMoney}
            className='input-money'
            value={this.state.money} />
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
            <MarketsPercentList 
              markets={marketsPercentsList}
              onListApproved={this.handleListApproved}
              onListDeclined={this.handleListDeclined}
              money={money} />
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
              disabled={this.state.errorNameIsNotUnique || this.state.errorNameLength}
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
      // get only existing in price list
      .filter(symbol => state.prices.items.hasOwnProperty(symbol))
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
    createPortfolio: (name, data, money, url) => {
      const user = cloud.auth().currentUser
      if (user && user.uid) {
        db.ref('portfolios').child(user.uid).push({
          name,
          data,
          url,
          firstMoney: money,
          createdAt: cloud.database.ServerValue.TIMESTAMP
        })
      }
      dispatch({
        type: 'CREATE_NEW_PORTFOLIO',
        name,
        data,
        money,
        firstMoney: money,
        url,
        saved: user && !!user.uid
      })
      dispatch({
        type: 'RESET_INTENT_FORM'
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntentAmount)
