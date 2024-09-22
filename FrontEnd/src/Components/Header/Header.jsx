import IconButton from "../IconButton/IconButton";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">E-Learning</div>
        <div className="icon-group">
          <IconButton label="Home" to="/" />
          <IconButton label="Courses" to="/Courses" />
          <IconButton label="Login / Register" to="/login" />
        </div>
      </nav>
    </header>
  );
};

export default Header;
