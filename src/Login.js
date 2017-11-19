import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  pure,
  compose
} from 'recompose'
import { cloud } from './cloud.js'
import {
  Button
} from 'semantic-ui-react'

const Login = ({user, onLogin}) => {
  const pending = user.pending
  const uid = user.user.uid
  if (uid) {
    return (
      <Redirect to={'/'} />
    )
  }

  return (
    <div className='app-loader'>
      <div className='app-loader-inner login-form'>
        <h2>Sign in</h2>
        {pending
          ? <div>loading...</div>
          : <Button
            className='btn-primary'
            onClick={onLogin} >
            Sign in with Google
          </Button>
        }
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
    onLogin: () => {
      dispatch({
        type: 'PENDING_LOGIN'
      })
      const provider = new cloud.auth.GoogleAuthProvider()
      cloud.auth().signInWithPopup(provider).then(result => {
        dispatch({
          type: 'SUCCESS_LOGIN',
          user: cloud.auth().currentUser
        })
      }).catch(error => {
        dispatch({
          type: 'ERROR_LOGIN',
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

export default enhance(Login)
