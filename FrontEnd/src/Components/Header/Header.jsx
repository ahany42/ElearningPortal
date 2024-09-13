import "./Header.css";
import { useState } from "react";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="navbar">
            <ul className={menuOpen ? "show" : ""}>
                <li><a href="#">Home</a></li>
                <li><a href="Courses">Courses</a></li>
                <li><a href="Deadlines">Deadlines</a></li>
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


