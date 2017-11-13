/* eslint-env jasmine */
import { intentForm } from '../rootReducers'

describe('reducers ', () => {
  it('set amount for the first income money', () => {
    const nextState = intentForm({},
      {
        type: 'INPUT_AMOUNT_MONEY',
        output: 49
      })
    expect(nextState).toMatchSnapshot()
  })
})
