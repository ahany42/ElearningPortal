import {useEffect, useState, useContext} from "react";
import { CurrentUserContext } from "../../App";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import 'react-toastify/dist/ReactToastify.css';
import {Button,FormControl,InputLabel,OutlinedInput,TextField,InputAdornment,Box,IconButton} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { NavLink, useNavigate } from "react-router-dom";
import { setCookie } from "../Cookie/Cookie.jsx";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeErrors, setActiveErrors] = useState([]);
  const [formData, setFormData] = useState({
      username: '',
      password: ''
  });
  const { setCurrentUser, setIsAuthenticated } = useContext(CurrentUserContext);
  const navigate = useNavigate();

    useEffect(() => {
        if (error && !activeErrors.includes(error)) {
            setActiveErrors([...activeErrors, error]);
            toast.error(error, {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                onClose: () => {
                    setError('') // Reset the error message
                    setActiveErrors(prevState => prevState.filter(e => e !== error))
                }
            });
        }
    }, [error]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Handle keypress for Enter key navigation
  const handleKeyPress = (e, field) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          if (!e.target.value) {
              setError(' Please enter your ' + field);
              return;
          }
          if (field === 'username') {
              setError('');
              // Move focus to the password field
              e.target.parentElement.parentElement.nextElementSibling.children[1].children[0].focus()
          } else if (field === 'password') {
              // Submit the form when pressing Enter on the password field
              handleSubmit(e);
          }
      }
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      setError('');
      try {
          const response = await fetch('http://localhost:3008/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
          });

          const data = await response.json();
          if (!data.error) {
              toast.success(data.message, {
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  style: {
                      userSelect: 'none',
                      gap: '10px',
                      padding: '20px',
                  }
              });

              // Successful login, redirect to courses
              setCookie('token', data.data);
              setIsAuthenticated(true);
              setCurrentUser(jwtDecode(data.data));
              navigate('/courses');
          } else {
              // Show error message
              setError(data.error);
              setIsAuthenticated(false);
          }
      } catch (error) {
          console.warn(error)
          setError(error);
          setIsAuthenticated(false);
      }
  };

  return (
    <>
      <Box sx={{ width: "700px", margin: "80px auto" }}>
        <h4 className="mb-3">Login to your account</h4>
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <TextField
            label="Username"
            name="username"
            fullWidth
            type="text"
            value={formData.username}
            onKeyDown={(e) => handleKeyPress(e, "username")}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
              setError("");
              toast.dismiss();
            }}
            required
            sx={{
              my: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "grey",
                },
                "&:hover fieldset": {
                  borderColor: "#274546",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#274546",
                },
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": {
                  color: "#274546 !important",
                },
              },
            }}
          />

          {/* Password Field */}
          <FormControl
            variant="outlined"
            fullWidth
            sx={{
              my: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "grey",
                },
                "&:hover fieldset": {
                  borderColor: "#274546",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#274546",
                },
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": {
                  color: "#274546 !important",
                },
              },
            }}
          >
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              name="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setError("");
              }}
              type={showPassword ? "text" : "password"}
              onKeyDown={(e) => handleKeyPress(e, "password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="contained"
            className="extraBold-text pascalCase-text"
            style={{ backgroundColor: "#fb8928", color: "black" }}
            fullWidth
            sx={{ my: 2 }}
          >
            Sign In
          </Button>

          {/* Forgot Password Link */}
          <NavLink
            to="/ForgetPassword"
            variant="body2"
            className="blue-text"
            style={{ display: "block", marginTop: "1rem" }}
          >
            Forgot password?
          </NavLink>

          {/* Sign Up Link */}
          <NavLink
            to="/signup"
            variant="body2"
            className="blue-text"
            style={{ display: "block", marginTop: "1rem" }}
          >
            Don't have an account? Sign up
          </NavLink>
        </form>
      </Box>
    </>
  );
};

export default Login;
