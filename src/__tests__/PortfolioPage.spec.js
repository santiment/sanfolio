/* eslint-env jasmine */
import React from 'react'
import {
  MemoryRouter,
  StaticRouter
} from 'react-router-dom'
import { configure, shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'
import {
  PortfolioPage,
  PortfoliosNaviagation,
  PortfolioList
} from '../PorfoliosPage'
configure({ adapter: new Adapter() })

describe('PortfolioPage', () => {
  let wrapper
  const portfolios = {
    selected: 0,
    items: [
      {
        name: 'Awesome',
        money: 23523,
        items: []
      },
      {
        name: 'Portfolio 2',
        money: 234222,
        items: []
      }
    ]
  }

  beforeEach(() => {
    wrapper = shallow(
      <MemoryRouter>
        <PortfolioPage portfolios={portfolios} />
      </MemoryRouter>)
  })

  it('should redirect to invest page, if portfolios items is empty', () => {
    const emptyPortfolios = {
      selected: 0,
      items: []
    }
    const redirectedWrapper = shallow(
      <StaticRouter context={{}}>
        <PortfolioPage portfolios={emptyPortfolios} />
      </StaticRouter>)
    expect(toJson(redirectedWrapper)).toMatchSnapshot()
  })

  it('should render correctly', () => {
    expect(wrapper.length).toEqual(1)
  })

  describe('PortfoliosNavigation', () => {
    it('should render correctly', () => {
      const navWrapper = mount(
        <MemoryRouter>
          <PortfoliosNaviagation portfolios={portfolios} />
        </MemoryRouter>)
      expect(navWrapper.find('ListHeader a').first().text()).toEqual(portfolios.items[0].name)
    })
  })

  describe('PortfolioList', () => {
    it('should render list sorted by money correctly', () => {
      const prices = {
        BTC: 12,
        ETH: 10,
        BCH: 5
      }
      const data = {
        BTC: 0.002,
        ETH: 0.2,
        BCH: 200
      }
      const portfolioListWrapper = shallow(<PortfolioList
        prices={prices}
        data={data}
      />)
      expect(toJson(portfolioListWrapper)).toMatchSnapshot()
      const items = portfolioListWrapper.find('.PortfolioList-item')
      const getItemSymbol = item => item.childAt(0).text()
      expect(items.length).toBe(3)
      expect(getItemSymbol(items.first())).toBe('BCH')
      expect(getItemSymbol(items.at(1))).toBe('ETH')
      expect(getItemSymbol(items.last())).toBe('BTC')
    })
  })
})
