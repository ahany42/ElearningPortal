import React from "react"; 
import "./Footer.css";
import {useLocation} from "react-router-dom";

const Footer = () => {
    const route = useLocation().pathname;
  return (
    <footer
      className="footer"
      style={route !== "/" ? { background: "#f1f1f1" } : {}}
    >
      <p>
        All Rights Reserved &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
