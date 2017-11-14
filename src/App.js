import React from 'react'
import { connect } from 'react-redux'
import IntentForm from './IntentForm'
import AssetList from './AssetList'
import './App.css'

export const App = ({markets}) => (
  <div className='wrapper'>
    <div className='app'>
      <AssetList markets={markets} />
      <IntentForm />
    </div>
  </div>
)

const mapStateToProps = state => {
  return {
    markets: state.markets
  }
}

export default connect(
  mapStateToProps
)(App)
