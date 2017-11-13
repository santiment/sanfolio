import React, { Component } from 'react';
import { connect } from 'react-redux';

class IntentAmount extends Component {

  state = {
    rawAmount: 0
  }

  handleChangeAmountMoney = e => {
    this.setState({rawAmount: e.target.value});
  }

  handleSubmitAmountMoney = e => {
    this.props.onSubmitAmountMoney(this.state.rawAmount);
  }

  render() {
    const {amountMoney, onSubmitAmountMoney} = this.props;
    return (
      <div>
        <p>Сколько вы хотите внести денег?</p>
        <input 
          type="number"
          onChange={this.handleChangeAmountMoney}
          value={this.state.rawAmount} />
        <button onClick={this.handleSubmitAmountMoney}>
          Просчитать
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    amountMoney: state.intentForm.amountMoney,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmitAmountMoney: amountMoney => {
      dispatch({
        type: 'INPUT_AMOUNT_MONEY',
        amountMoney
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntentAmount);
