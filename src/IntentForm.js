import React, { Component } from 'react';
import { connect } from 'react-redux';

const MarketsPercentList = ({data, money}) => {
  const getPercent = mPercent => mPercent[Object.keys(mPercent)[0]]
  const getSymbol = mPercent => Object.keys(mPercent)[0]
  return (
    <div>
      {data.map((mPercent, index) => (
        <div key={index}>
          {getSymbol(mPercent)} - {getPercent(mPercent)}%
          &nbsp;&nbsp;
          {money > 0 && (getPercent(mPercent) / 100 * money).toFixed(2)}
        </div>
      ))}
    </div>
  );  
}

class IntentAmount extends Component {

  state = {
    rawAmount: 0
  }

  handleChangeMoney = e => {
    this.setState({rawAmount: e.target.value});
  }

  handleSubmitMoney = e => {
    this.props.onSubmitMoney(this.state.rawAmount);
    this.setState({rawAmount: 0});
  }

  render() {
    const {money, marketsPercentsList} = this.props;
    return (
      <div>
        <h3>Your current money is {money}</h3>
        <hr/>
        <p>How much money you wish to invest in the crypto world?</p>
        <input 
          type="number"
          onChange={this.handleChangeMoney}
          value={this.state.rawAmount} />
        <button onClick={this.handleSubmitMoney}>
          Calculate
        </button>

        <hr/>
        <MarketsPercentList data={marketsPercentsList} money={money} />

        {money > 0 &&
        <div>
          <hr/>
          <button stype={{border: '1px solid black', borderRadius: 4}}>
            Confirm balanced investing schema
          </button>
        </div>
        }
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
    money: state.intentForm.money
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmitMoney: money => {
      dispatch({
        type: 'INPUT_AMOUNT_MONEY',
        money
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntentAmount);
