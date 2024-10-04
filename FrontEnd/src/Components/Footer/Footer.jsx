import React from "react"; 
import "./Footer.css";
import {useLocation} from "react-router-dom";

const Footer = () => {
    const route = useLocation().pathname;
  return (
    <footer className="footer"
            style={route !== "/"? {background: "#2D3480"} : {}}>
      <p className="orange-text">All Rights Reserved &copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;
