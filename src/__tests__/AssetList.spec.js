/* eslint-env jasmine */
import React from 'react'
import { configure, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import AssetList from '../AssetList'
configure({ adapter: new Adapter() })

describe('AssetList', () => {
  let wrapper

  const markets = {
    'BTC': 1202021,
    'ETH': 500000
  }

  const prices = {
    'BTC': 120,
    'ETH': 500
  }

  const history = {
    'BTC': [119],
    'ETH': [400]
  }

  beforeEach(() => {
    wrapper = shallow(<AssetList
      markets={markets}
      prices={prices}
      history={history} />)
  })

  it('should render correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('render the DUMB component', () => {
    expect(wrapper.length).toEqual(1)
  })
})
