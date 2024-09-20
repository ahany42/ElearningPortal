import React, {useState} from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormLabel,
  FormControlLabel,
  TextField,
  InputAdornment,
  Box,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { NavLink } from "react-router-dom";
const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [genderValue, setGenderValue] = useState("");
  const [formData, setFormData] = useState({
      name:'',
      gender:genderValue,
      username:'',
      role:'User',
      email: '',
      password: '',
      confirmpassword:'',
  });
 
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleGenderChange = (event)=>{
    setGenderValue(event.target.value);
    setFormData((prevData) => ({
      ...prevData,
      gender:event.target.value ,
    }));
  }
  const handleSubmit = async(event) => {
    event.preventDefault();
    if(!formData.name || !formData.email || !formData.gender 
    ||!formData.password ||!formData.username || !formData.confirmpassword )
    toast.warn("Please Fill All Fields");
    else if(formData.password !== formData.confirmpassword && formData.password && formData.confirmpassword)
    toast.warn("Password and Confirm Password are not matching")
    else{
      try {
        console.log(formData);
        const response = await axios.post('http://localhost:3008/register', 
          JSON.stringify(formData), 
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
        if (response.status !== 200) {
         toast.success(response.data.message);
        } else {
          toast.warn(response.data.error);
        }
      } catch (error) {
        toast.warn('Something went wrong. Please try again.');
    }
     
  }
}
 

  return (
    <>
    <ToastContainer/>
        <Box  sx={{width: '80%', margin: '80px auto'}}>
         <h4>Create New Account</h4>
         <form onSubmit={handleSubmit}>
        <TextField label="Full Name" name="name" fullWidth type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required
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
       <TextField label="User Name" name="username" fullWidth type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required
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
      <TextField label="Email" name="email" fullWidth type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required
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
      <FormControl variant="outlined" fullWidth
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
        <OutlinedInput name="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        
      </FormControl> 
      <FormControl
        variant="outlined"fullWidth
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
        <InputLabel>Confirm Password</InputLabel>
        <OutlinedInput name="password" required value={formData.confirmpassword} onChange={(e) => setFormData({...formData, confirmpassword: e.target.value})}
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Confirm Password"
        />
        
      </FormControl> 
      <FormControl>
      <FormLabel>Gender</FormLabel>
      <RadioGroup value={genderValue} onChange={handleGenderChange} >
      <Box display="flex" flexDirection="row">
          <FormControlLabel value="Male" control={<Radio onClick={()=>handleGenderChange("male")}/>} label="Male"/>
          <FormControlLabel value="Female" control={<Radio onClick={()=>handleGenderChange("female")}/>} label="Female" />
        </Box>
      </RadioGroup>
    </FormControl>
      {/* Sign In Button */}
      <Button type="submit" variant="contained" className="green-bg pascalCase-text" fullWidth sx={{ my: 2 }}>
        Sign Up
      </Button>

      {/* Sign Up Link */}
      <NavLink to="/" variant="body2" className="blue-text" style={{ display: "block", marginTop: "1rem" }}>
        Have an account? Sign in
      </NavLink>
      </form>
    </Box>
    </>
  );
}

export default SignUp;
