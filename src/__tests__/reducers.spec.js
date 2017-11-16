/* eslint-env jasmine */
import {
  intentForm,
  settings,
  portfolios
} from '../rootReducers'

describe('reducers ', () => {
  it('set amount for the first income money', () => {
    const nextState = intentForm({},
      {
        type: 'INPUT_AMOUNT_MONEY',
        output: 49
      })
    expect(nextState).toMatchSnapshot()
  })

  it('change settings', () => {
    const nextState = settings({realtime: true},
      {
        type: 'CHANGE_SETTINGS',
        realtime: false
      })
    expect(nextState).toMatchSnapshot()
  })

  describe('Portfolio Reducer ', () => {
    it('should create new portfolio and select created portfolio', () => {
      const oldState = {
        selected: 0,
        items: [
          {
            name: 'Portfolio 1'
          },
          {
            name: 'Portfolio 2'
          }
        ]
      }
      const nextState = portfolios(oldState,
        {
          type: 'CREATE_NEW_PORTFOLIO',
          name: 'Portfolio 3',
          items: [],
          money: 23440
        })
      expect(nextState.selected).toBe(2)
      expect(nextState.items.length).toBe(3)
      expect(nextState).toMatchSnapshot()
    })

    it('should select the portfolio', () => {
      const oldState = {
        selected: 0,
        items: [
          {
            name: 'Portfolio 1'
          },
          {
            name: 'Portfolio 2'
          }
        ]
      }
      const nextState = portfolios(oldState,
        {
          type: 'SELECT_PORTFOLIO',
          selected: 1
        })
      expect(nextState).toMatchSnapshot()
    })

    it('should remove selected portfolio', () => {
      const oldState = {
        selected: 0,
        items: [
          {
            name: 'Portfolio 1'
          },
          {
            name: 'Portfolio 2'
          }
        ]
      }
      const nextState = portfolios(oldState,
        {
          type: 'REMOVE_SELECTED_PORTFOLIO'
        })
      expect(nextState.items.length).toBe(1)
      expect(nextState).toMatchSnapshot()
    })

    it('should update selected portfolio', () => {
      const oldState = {
        selected: 0,
        items: [
          {
            name: 'Portfolio 1',
            items: [],
            money: 10
          },
          {
            name: 'Portfolio 2'
          }
        ]
      }
      const nextState = portfolios(oldState,
        {
          type: 'UPDATE_SELECTED_PORTFOLIO',
          name: 'Awesome Portfolio',
          items: [],
          money: 200
        })
      expect(nextState.items.length).toBe(2)
      expect(nextState).toMatchSnapshot()
    })

    it('should not select non existing Portfolio', () => {
      const oldState = {
        selected: 1,
        items: [
          {
            name: 'Portfolio 1'
          },
          {
            name: 'Portfolio 2'
          }
        ]
      }
      const nextState = portfolios(oldState,
        {
          type: 'SELECT_PORTFOLIO',
          selected: 3
        })
      expect(nextState).toMatchSnapshot()
    })
  })
})
