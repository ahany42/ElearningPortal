import React, {useState} from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
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
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { NavLink } from "react-router-dom";
const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
      name:'',
      gender:"male",
      userName:'',
      role:'',
      email: '',
      password: '',
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = (event) => 
    event.preventDefault();
    setFormData({
      email : formData.get("email"),
      password : formData.get("password"),
      userName : formData.get("username"),
      name : formData.get("name"),
      gender : formData.get("gender"),
      role : "User"
    });
  ;

  return (
    <Box onSubmit={handleSubmit} sx={{width: '80%', margin: '80px auto'}}>
         <h4>Create New Account</h4>
        <TextField
        label="Full Name"
        name="Name"
        fullWidth
        type="text"
        value={formData.name}
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
       <TextField
        label="User Name"
        name="username"
        fullWidth
        type="text"
        value={formData.userName}
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
          required
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
        Sign Up
      </Button>

      {/* Sign Up Link */}
      <NavLink
        to="/"
        variant="body2"
        className="blue-text"
        style={{ display: "block", marginTop: "1rem" }}
      >
        Have an account? Sign in
      </NavLink>
    </Box>
  );
}

export default SignUp;
