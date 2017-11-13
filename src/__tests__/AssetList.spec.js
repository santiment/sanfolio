/* eslint-env jasmine */
import React from 'react'
import { configure, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import AssetList from '../AssetList'
configure({ adapter: new Adapter() })

describe('AssetList', () => {
  let wrapper
  const assets = {
    'BTC': 1202021,
    'ETH': 500000
  }

  beforeEach(() => {
    wrapper = shallow(<AssetList markets={assets} />)
  })

  it('should render correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('render the DUMB component', () => {
    expect(wrapper.length).toEqual(1)
  })
})
