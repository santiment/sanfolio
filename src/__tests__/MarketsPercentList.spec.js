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

  const data = {
    ADA: 11.609008590666358,
    BCH: 0.007558669061380139,
    BTC: 0.00750053228379006,
    DASH: 0.0034625156131839,
    EOS: 0.2208225112777211,
    ETC: 0.04403520558230914,
    ETH: 0.04307733540298107,
    HSR: 0.01925753932664638,
    LSK: 0.051347106439531234,
    LTC: 0.024265747042433658,
    MIOTA: 1.2532610657778096,
    NEO: 0.02912821789038175
  }

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
        data={data}
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
          data={data}
          prices={prices}
          money={money} />
      )
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })
})
