import React, {useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  FormControl,
  TextField,
  Box,
} from "@mui/material";
import axios from 'axios';
import { NavLink } from "react-router-dom";
const ForgotPassword = () => {
  const [formData, setFormData] = useState({
      email: '',
  });

   const handleSubmit = async(event) => {
    event.preventDefault();
    console.log(formData.email);
    try{
      const response = await axios.post('http://localhost:3008/forgotPassword', { formData });
      if (response.status === 200) {
        toast.success(response.message);
      } else {
        toast.warn(response.message);
      }
    }
    catch(error){
      toast.warn('Something went wrong. Please try again.');
    }
     
  };

  return (
    <>
      <ToastContainer/>
    <Box sx={{width: '80%', margin: '80px auto'}}>
      <h4>Reset Your Password</h4>
      <form onSubmit={handleSubmit} >
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
      </form>
    </Box>
    </>
  );
};

export default ForgotPassword;
