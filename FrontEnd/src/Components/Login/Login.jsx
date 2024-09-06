import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { NavLink } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    alert(`Signing in with Email: ${email}, Password: ${password}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email Field */}
      <TextField
        label="Email"
        name="email"
        type="email"
        size="small"
        fullWidth
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
        variant="outlined"
        sx={{ my: 2 }}
      />

      {/* Password Field */}
      <FormControl variant="outlined" fullWidth sx={{ my: 2 }}>
        <InputLabel>Password</InputLabel>
        <OutlinedInput
          name="password"
          type={showPassword ? "text" : "password"}
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
        color="primary"
        fullWidth
        sx={{ my: 2 }}
      >
        Sign In
      </Button>

      {/* Forgot Password Link */}
      <NavLink
        to="/ForgetPassword"
        variant="body2"
        style={{ display: "block", marginTop: "1rem" }}
      >
        Forgot password?
      </NavLink>

      {/* Sign Up Link */}
      <NavLink
        to="/signup"
        variant="body2"
        style={{ display: "block", marginTop: "1rem" }}
      >
        Don't have an account? Sign up
      </NavLink>
    </form>
  );
};

export default Login;
