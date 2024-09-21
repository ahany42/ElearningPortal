import IconButton from '../IconButton/IconButton'
import React from 'react'
import './HomePage.css'
const HomePage = () => {
return (
 <div className='home-container'>
     <div className="overlay">
        <div className="icon-group">
        <IconButton label='Login' to='/'/>
        <IconButton label='SignUp' to='/SignUp'/>
        <IconButton label='Courses' to='/Courses'/>
        </div>
    </div>
 </div>
)
}

export default HomePage
