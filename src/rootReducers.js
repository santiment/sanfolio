import { combineReducers } from 'redux'

export const markets = (state = {}, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const intentForm = (state = {amountMoney: 0}, action) => {
  switch (action.type) {
    case 'INPUT_AMOUNT_MONEY':
      return {
        ...state,
        amountMoney: action.output
      }
    default:
      return state
  }
}

export default combineReducers({
  markets,
  intentForm
})
