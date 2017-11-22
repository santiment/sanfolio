import React from 'react'
import {
  Button,
  Message,
  Header
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import {
  pure,
  compose
} from 'recompose'
import { cloud } from './cloud'
import './Settings.css'

const list = [
  'Update all icons',
  'Some fixes...'
]

const Settings = ({user, onSignout}) => {
  return (
    <div className='Settings'>
      <div className='settings-main'>
        <h3>Current user is {user.user.displayName || user.user.email}</h3>
        <Button
          onClick={onSignout}>
          Sign out
        </Button>
      </div>
      <div className='settings-footer'>
        <Header as='h4'>Version: 0.2.1</Header>
        <Message
          positive
          header='CHANGELOG: 2017-11-22'
          list={list}
        />
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSignout: () => {
      dispatch({
        type: 'PENDING_LOGOUT'
      })
      cloud.auth().signOut().then(() => {
        dispatch({
          type: 'SUCCESS_LOGOUT'
        })
      }).catch(error => {
        dispatch({
          type: 'ERROR_LOGOUT',
          error: error.message
        })
      })
    }
  }
}

const enhance = compose(
  pure,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(Settings)
