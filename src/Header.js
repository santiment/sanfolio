import React from 'react'
import PropTypes from 'prop-types'
import './Header.css'

const Header = ({title, children}) => {
  return (
    <div className='page-header'>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default Header
