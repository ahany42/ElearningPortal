import React from "react"; 
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>All Rights Reserved &copy; {new Date().getFullYear()}</p>
      {/* Dynamic copyright year */}
    </footer>
  );
};

export default Footer;
