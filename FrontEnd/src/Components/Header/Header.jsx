import "./Header.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="navbar">
            <ul className={menuOpen ? "show" : ""}>
                <li><NavLink to='/'>Home</NavLink></li>
                <li><NavLink to='/courses'>Courses</NavLink></li>
                <li><NavLink to='/deadlines'>Deadlines</NavLink></li>
            </ul>
            <button className="toggle-menu" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    );
}

export default Header;


