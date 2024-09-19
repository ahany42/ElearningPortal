import React, {useState} from "react";
import {
  Button,
  FormControl,
  TextField,
  Box,
} from "@mui/material";
import { NavLink } from "react-router-dom";
const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
      email: '',
  });

   const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
  };

  return (
    <Box onSubmit={handleSubmit} sx={{width: '80%', margin: '80px auto'}}>
      <h4>Reset Your Password</h4>
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
      </FormControl> 
      <Button
        type="submit"
        variant="contained"
        className="green-bg pascalCase-text"
        fullWidth
        sx={{ my: 2 }}
      >
        Reset Password
      </Button>

      {/* Forgot Password Link */}
      <NavLink
        to="/"
        variant="body2"
        className="blue-text"
        style={{ display: "block", marginTop: "1rem" }}
      >
        Back to Login
      </NavLink>
    </Box>
  );
};

export default ForgotPassword;
