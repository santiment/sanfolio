import React from 'react'
import { connect } from 'react-redux'
import IntentForm from './IntentForm'
import AssetList from './AssetList'
import './App.css'

export const App = ({markets}) => (
  <div className='App'>
    <AssetList markets={markets} />
    <IntentForm />
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
