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
  PortfoliosNaviagation
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

  describe('PortfoliosNaviagation', () => {
    it('should render correctly', () => {
      const navWrapper = mount(
        <MemoryRouter>
          <PortfoliosNaviagation portfolios={portfolios} />
        </MemoryRouter>)
      expect(navWrapper.find('ListHeader a').first().text()).toEqual(portfolios.items[0].name)
    })
  })
})
