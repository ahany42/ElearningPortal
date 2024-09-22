import IconButton from '../IconButton/IconButton'
import './Header.css';

const Header = () => {

  return (
      <div className="overlay">
          <div className="icon-group">
              <IconButton label='Home' to='/'/>
              <IconButton label='Courses' to='/Courses'/>
              <IconButton label='Login / Register' to='/login'/>
          </div>
      </div>
  )
}

export default Header


