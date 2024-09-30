import React from 'react'
import './IconButton.css'
import { NavLink } from 'react-router-dom'

const IconButton = ({label,to}) => {

  if (!to) {
    return (
      <div className='icon-button'>
        {label}
      </div>
    )
  }

  return (
      <NavLink to={to} style={{textDecoration: 'none', color: 'inherit'}}
               onDragStart={(e) => e.preventDefault()}>
        <div className='icon-button'>
          {label}
        </div>
      </NavLink>
  )
}

export default IconButton
