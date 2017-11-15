import { combineReducers } from 'redux'

export const markets = (state = {isLoading: true, error: false, items: []}, action) => {
  switch (action.type) {
    case 'SUCCESS_MARKETS':
      return {
        ...state,
        isLoading: false,
        error: false,
        items: action.payload.data.data
      }
    default:
      return state
  }
}

export const prices = (state = {isLoading: true, error: false, items: []}, action) => {
  switch (action.type) {
    case 'SUCCESS_PRICES':
      return {
        ...state,
        isLoading: false,
        error: false,
        items: action.payload.data.data
      }
    case 'FIRE_TICKET':
      return {
        ...state,
        life: {
          ...state.life,
          [action.title]: action.price.toFixed(2)
        }
      }
    default:
      return state
  }
}

export const intentForm = (state = {money: 0}, action) => {
  switch (action.type) {
    case 'INPUT_AMOUNT_MONEY':
      return {
        money: action.money
      }
    default:
      return state
  }
}

export const portfolios = (state = {}, action) => {
  switch (action.type) {
    case 'CREATE_NEW_PORTFOLIO':
      return {
        ...state,
        selected: 1,
        items: [{[action.name]: {
          name: action.name,
          items: action.items,
          money: action.money
        }}]
      }
    default:
      return state
  }
}

export default combineReducers({
  markets,
  prices,
  intentForm,
  portfolios
})
