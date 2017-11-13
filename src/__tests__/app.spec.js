/* eslint-env jasmine */
import React from 'react'
import { Provider } from 'react-redux'
import { configure, shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
import Adapter from 'enzyme-adapter-react-16'
import ConnectedApp from '../App'
configure({ adapter: new Adapter() })
const mockStore = configureStore()
let container

beforeEach(() => {
  const store = mockStore({})
  container = shallow(
    <Provider store={store}>
      <ConnectedApp />
    </Provider>
  )
})

it('renders without crashing', () => {
  expect(container.length).toEqual(1)
})
