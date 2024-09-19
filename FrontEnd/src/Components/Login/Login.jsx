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
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { NavLink } from "react-router-dom";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
      email: '',
      password: ''
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async(event) => {
    event.preventDefault();
    if(formData.email && formData.password){
      try {
        const response = await axios.post('http://localhost:3008/login', { formData });
        if (response.status !== 200) {
         toast.success(response.message);
        } else {
          toast.warn(response.message);
        }
      } catch (error) {
        toast.warn('Something went wrong. Please try again.');
    }
  }
  else{
    toast.warn("Please Fill All Fields");
  }
  };

  return (
    <>
    <ToastContainer/>
    <Box  sx={{width: '80%', margin: '80px auto'}}>
        <h4>Login to your account</h4>
        <form onSubmit={handleSubmit}>
      {/* Email Field */}
      <TextField
        label="Email"
        name="email"
        fullWidth
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
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
    </>
  );
};

export default Login;
