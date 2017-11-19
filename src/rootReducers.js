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
        live: {
          ...state.live,
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
    case 'RESET_INTENT_FORM':
      return {
        money: 0
      }
    default:
      return state
  }
}

export const portfolios = (state = {selected: 0, items: []}, action) => {
  switch (action.type) {
    case 'CREATE_NEW_PORTFOLIO':
      const last = state.items.length
      return {
        selected: last,
        items: [
          ...state.items,
          {
            name: action.name,
            url: action.url,
            data: action.data,
            money: action.money
          }]
      }
    case 'SUCCESS_FETCHED_PORTFOLIOS':
      const portfolios = action.portfolios
      const items = Object.keys(portfolios).map(key => {
        portfolios[key].id = key
        return portfolios[key]
      })
      console.log('check', items);
      return {
        ...state,
        items
      }
    case 'SELECT_PORTFOLIO':
      const newSelected = action.selected &&
        state.items.length > action.selected
        ? action.selected
        : state.selected
      return {
        ...state,
        selected: newSelected
      }
    case 'REMOVE_SELECTED_PORTFOLIO':
      const idRemovedPortfolio = state.selected
      return {
        selected: 0,
        items: [
          ...state.items.slice(0, idRemovedPortfolio),
          ...state.items.slice(idRemovedPortfolio + 1, state.items.length)
        ]
      }
    case 'UPDATE_SELECTED_PORTFOLIO':
      return {
        selected: state.selected,
        items: [
          ...state.items.slice(0, state.selected),
          {
            name: action.name,
            items: action.items,
            money: action.money
          },
          ...state.items.slice(state.selected + 1, state.items.length)
        ]
      }
    default:
      return state
  }
}

export const settings = (state = {realtime: true}, action) => {
  switch (action.type) {
    case 'CHANGE_SETTINGS':
      return {
        ...state,
        realtime: action.realtime
      }
    default:
      return state
  }
}

export const user = (state = {
  isLoading: true,
  pending: false,
  error: false,
  user: {}
}, action) => {
  switch (action.type) {
    case 'APP_LOADING':
      return {
        ...state,
        isLoading: false
      }
    case 'SUCCESS_LOGIN':
      return {
        ...state,
        pending: false,
        error: false,
        isLoading: false,
        user: action.user
      }
    case 'PENDING_LOGIN':
      return {
        ...state,
        pending: true,
        isLoading: false,
        error: false
      }
    case 'SUCCESS_LOGOUT':
      return {
        ...state,
        pending: false,
        error: false,
        isLoading: false,
        user: {}
      }
    default:
      return state
  }
}

export default combineReducers({
  markets,
  prices,
  intentForm,
  portfolios,
  settings,
  user
})
