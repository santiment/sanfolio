/* eslint-env jasmine */
import { MarketsPercentList, AssetRow } from '../MarketsPercentList.js'
import React from 'react'
import { configure, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

describe('MarketsPercentList', () => {
  const markets = [
    {'BTC': 56.60},
    {'ETH': 20.00},
    {'ETC': 12.12}
  ]

  const money = 250

  const prices = [
    {'BTC': 7700},
    {'ETH': 330},
    {'ETC': 66}
  ]

  it('should render correctly', () => {
    const wrapper = mount(
      <MarketsPercentList
        markets={markets}
        prices={prices}
        money={money} />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  describe('AssetRow', () => {
    it('should render correctly', () => {
      const wrapper = mount(
        <AssetRow
          index={0}
          cap={{
            'BTC': 56.60
          }}
          prices={prices}
          money={money} />
      )
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })
})
