/* eslint-env jasmine */
import AssetItem from '../AssetItem.js'
import React from 'react'
import { configure, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

describe('AssetItem', () => {
  let wrapper
  const asset = {
    title: 'BTC',
    index: 0,
    cap: 1202021
  }

  beforeEach(() => {
    wrapper = shallow(<AssetItem asset={asset} />)
  })

  it('should render correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('render the DUMB component', () => {
    expect(wrapper.length).toEqual(1)
  })

  it('contains output', () => {
    expect(wrapper.find('strong').text()).toEqual(asset.title)
  })
})
