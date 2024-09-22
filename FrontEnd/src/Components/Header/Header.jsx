import IconButton from "../IconButton/IconButton";
import MuiIconButton from '@mui/material/IconButton';
import "./Header.css";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useState} from "react";
import {NavLink} from "react-router-dom";
import {v4} from "uuid";

const pages = [
    { name: 'Home', to: '/'},
    { name: 'Courses', to: '/Courses'},
    { name: 'Login / Register', to: '/login'},
];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">E-Learning</div>
        <div className="icon-group">
          <IconButton label="Home" to="/" />
          <IconButton label="Courses" to="/Courses" />
          <IconButton label="Login / Register" to="/login" />
        </div>
        <Box sx={{ display:
              { xs: 'flex', sm: 'flex', md: 'none',
                '@media (max-width: 768px)': { display: 'flex' }, '@media (min-width: 769px)': { display: 'none' } } }}>
          <MuiIconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
          >
            <MenuIcon />
          </MuiIconButton>
          <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none', '@media (max-width: 768px)':
                      { display: 'block' }, '@media (min-width: 769px)': { display: 'none' } } }}
          >
            {pages.map((page) => (
                <NavLink key={v4()} to={page.to} style={{textDecoration: 'none'}}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: 'center' }}>
                      {page.name}
                    </Typography>
                  </MenuItem>
                </NavLink>
            ))}
          </Menu>
        </Box>
      </nav>
    </header>
  );
};

export default Header;
