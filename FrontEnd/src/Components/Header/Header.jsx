import IconButton from "../IconButton/IconButton";
import MuiIconButton from '@mui/material/IconButton';
import "./Header.css";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useState, useContext} from "react";
import {CurrentUserContext} from "../../App";
import {NavLink, useLocation} from "react-router-dom";
import {v4} from "uuid";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const pages = [
    { name: 'Courses', to: '/courses'}, // This is the only page that is not protected (logged in or not)
    { auth: true, name: 'My Courses', to: '/MyCourses', role: ["student", "instructor"]}, // This page is protected (must be
    // logged in)
    { auth: true, name: 'Deadlines', to: '/deadline', role: ["student"]}, // This page is protected (must be
    { auth: true, name: 'Progress', to: `/ViewProgress`, role: ["student"]}, // This page is protected (must be
    // logged in)
];

const burgerListPages = [
    { name: 'Courses', to: '/courses'},
    { auth: true, name: 'My Courses', to: '/MyCourses', role: ["student", "instructor"]},
    { auth: true, name: 'Deadline', to: '/deadline', role: ["student"]},
    { auth: true, name: 'Progress', to: `/ViewProgress`, role: ["student"]}, // This page is protected (must be
    { auth: false, name: 'Login', to: '/login' },
    { auth: false, name: 'Register', to: '/SignUp' },
    { auth: true, name: 'Profile', to: '/profile' },
    { auth: true, name: 'Logout', to: '/logout' },
]

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const { isAuthenticated, currentUser } = useContext(CurrentUserContext);
  const route = useLocation().pathname;

  const profileOptions = isAuthenticated ? [
      { name: 'Profile', to: '/profile' },
      { name: 'Logout', to: '/logout' },
  ] : [
          { name: 'Login', to: '/login' },
          { name: 'Register', to: '/SignUp' },
      ];

  const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
      setAnchorElNav(null);
  };

  const handleOpenProfileMenu = (event) => {
      setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
      setAnchorElProfile(null);
  };

  return (
    <header className="header"
            style={route === "/"? {position: "absolute", top: 0, zIndex: "100"} : {}}>
      <nav className="navbar"
           style={route === "/"? {boxShadow: "0 0 20px 2px #00000052", background: "#3d673400"} : {}}>
          <NavLink to='/' style={{textDecoration: 'none'}}
                   onDragStart={(e) => e.preventDefault()}>
              <div className="logo">E-Learning</div>
          </NavLink>
        <div className="icon-group">
            {
                pages.map((page) => (
                    currentUser.role && page.role && page.role.includes(currentUser.role.toLowerCase())?
                        page.auth === undefined ? (
                            <IconButton key={page.name} label={page.name} to={page.to} className="nav-icon-buttons" />
                        ) : page.auth === isAuthenticated && (
                            <IconButton key={page.name} label={page.name} to={page.to} className="nav-icon-buttons" />
                        )
                    : !page.role ?
                            page.auth === undefined ? (
                                <IconButton key={page.name} label={page.name} to={page.to} className="nav-icon-buttons" />
                            ) : page.auth === isAuthenticated && (
                                <IconButton key={page.name} label={page.name} to={page.to} className="nav-icon-buttons" />
                            )
                        :
                            null
                ))
            }

            {/* Profile Icon with Dropdown */}
            <MuiIconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleOpenProfileMenu}
                color="inherit">
                <AccountCircleIcon fontSize="large" sx={{ color: '#f1f1f1' }}/>
            </MuiIconButton>
            <Menu
                id="profile-menu"
                anchorEl={anchorElProfile}
                open={Boolean(anchorElProfile)}
                onClose={handleCloseProfileMenu}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {profileOptions.map((option) => (
                    <NavLink key={v4()} to={option.to} style={{ textDecoration: 'none' }}
                             onDragStart={(e) => e.preventDefault()}>
                        <MenuItem onClick={handleCloseProfileMenu}>
                            <Typography>{option.name}</Typography>
                        </MenuItem>
                    </NavLink>
                ))}
            </Menu>
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
          <MenuIcon sx={{ color: 'white', fontSize: "40px" }} />
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
            {burgerListPages.map((page) => (
                currentUser.role && page.role && page.role.includes(currentUser.role.toLowerCase())?
                    page.auth === undefined ? (
                        <NavLink key={v4()} to={page.to} style={{textDecoration: 'none'}}
                                 onDragStart={(e) => e.preventDefault()}>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography sx={{ textAlign: 'center' }}>
                                    {page.name}
                                </Typography>
                            </MenuItem>
                        </NavLink>
                    ) : (
                        isAuthenticated === page.auth &&
                        <NavLink key={v4()} to={page.to} style={{textDecoration: 'none'}}
                                 onDragStart={(e) => e.preventDefault()}>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography sx={{ textAlign: 'center' }}>
                                    {page.name}
                                </Typography>
                            </MenuItem>
                        </NavLink>
                    )
                : !page.role ?
                        page.auth === undefined ? (
                            <NavLink key={v4()} to={page.to} style={{textDecoration: 'none'}}
                                     onDragStart={(e) => e.preventDefault()}>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {page.name}
                                    </Typography>
                                </MenuItem>
                            </NavLink>
                        ) : (
                            isAuthenticated === page.auth &&
                            <NavLink key={v4()} to={page.to} style={{textDecoration: 'none'}}
                                     onDragStart={(e) => e.preventDefault()}>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {page.name}
                                    </Typography>
                                </MenuItem>
                            </NavLink>
                        )
                :
                    null
            ))}
          </Menu>
        </Box>
      </nav>
    </header>
  );
};

export default Header;
