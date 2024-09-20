import React, {useEffect, useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    TextField,
    InputAdornment,
    Box,
    IconButton, Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { NavLink, useNavigate } from "react-router-dom";
import { setCookie } from "../Cookie/Cookie.jsx";

const Login = ({ setIsAuthenticated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
      username: '',
      password: ''
  });
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Handle keypress for Enter key navigation
  const handleKeyPress = (e, field) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          if (!e.target.value) return;
          if (field === 'username') {
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
              // Successful login, redirect to courses
              setCookie('token', data.data);
              setIsAuthenticated(true);
              toast.success("Welcome Back!")
              navigate('/courses');
          } else {
              // Show error message
              setError(data.error);
              setIsAuthenticated(false);
          }
      } catch (error) {
          setError(error);
          setIsAuthenticated(false);
      }
  };

  return (
    <Box sx={{width: '80%', margin: '80px auto'}}>
        <h4>Login to your account</h4>
        {
            error &&
            <Alert severity="error" sx={{margin: '1rem 0'}} onClose={() => {setError("")}}>
                This Alert displays the default close icon.
            </Alert>
        }
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <TextField
            label="Username"
            name="username"
            fullWidth
            type="text"
            value={formData.username}
            onKeyDown={(e) => handleKeyPress(e, 'username')}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
            sx={{
              my: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'grey',
                },
                '&:hover fieldset': {
                  borderColor: '#274546',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#274546',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: '#274546 !important',
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
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'grey',
                },
                '&:hover fieldset': {
                  borderColor: '#274546',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#274546',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: '#274546 !important',
                },
              },
            }}
          >
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              type={showPassword ? 'text' : 'password'}
              onKeyDown={(e) => handleKeyPress(e, 'password')}
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
            className="green-bg pascalCase-text"
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
  );
};

export default Login;
