import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState ,useEffect } from 'react';
import { Link , useLocation} from 'react-router-dom';
import './Header.css';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const MobileNavBarHandler = ()=>{
    setIsMenuOpen(!isMenuOpen);
  }
  const location = useLocation();
  useEffect(()=>{
  setIsMenuOpen(false);
  },[location]);
  const ComingSoon = ()=>{
    alert("Coming Soon");
  }
  return (
    <div className="Header">
      <div className="DesktopNav">
      <li className="NavBar">
      <Link to="/Home" className={location.pathname === '/Home' ? 'active-link LinkStyle' : 'LinkStyle'}> Home </Link>
      <Link to="/Courses" className={location.pathname === '/Courses' ? 'active-link LinkStyle' : 'LinkStyle'}> Courses </Link>
      <Link to="/" className={location.pathname === '/' ? 'active-link LinkStyle' : 'LinkStyle'} > Login </Link>
      <Link to="/Deadline" className={location.pathname === '/Deadline' ? 'active-link LinkStyle' : 'LinkStyle'} > Deadline </Link>
      </li>
      </div>
      <div className="MobileHeader">
      <div className="MobileNavBar">
     <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} color='white'style={{ color: 'white', fontSize: '30px'}} onClick={MobileNavBarHandler}/>
</div>
      {isMenuOpen && <div className="MobileNav">
      <li>
      <Link to="/Home" className={location.pathname === '/Home' ? 'active-link LinkStyle' : 'LinkStyle'}> Home </Link>
      <Link to="/Courses" className={location.pathname === '/Courses' ? 'active-link LinkStyle' : 'LinkStyle'}> Courses </Link>
      <Link to="/" className={location.pathname === '/' ? 'active-link LinkStyle' : 'LinkStyle'} > Login </Link>
      <Link to="/Deadline" className={location.pathname === '/Deadline' ? 'active-link LinkStyle' : 'LinkStyle'} > Deadline </Link>
      </li>
      </div>}
    </div>
    </div>
  )
}

export default Header


