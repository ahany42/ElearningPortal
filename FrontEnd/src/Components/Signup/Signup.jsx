import { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  Tooltip
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InfoOutlined from '@mui/icons-material/InfoOutlined'; // Import Info icon
import { NavLink } from "react-router-dom";
import {setCookie} from "../Cookie/Cookie.jsx";
import {jwtDecode} from "jwt-decode";


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [genderValue, setGenderValue] = useState("Male");
  const [formData, setFormData] = useState({
    name: "",
    gender: genderValue,
    username: "",
    role: "Student",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const { setIsAuthenticated, setCurrentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();


  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleGenderChange = (event)=> {
    setGenderValue(event.target.value);
    setFormData((prevData) => ({
      ...prevData,
      gender:event.target.value ,
    }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.gender
        ||!formData.password ||!formData.username || !formData.confirmpassword )
      toast.error("Please Fill All Fields", {
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
    else if (formData.password !== formData.confirmpassword && formData.password && formData.confirmpassword)
      toast.error("Password and Confirm Password are not matching", {
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
    else {
      try {
        const res = await fetch('http://localhost:3008/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
            }
        );

        const response = await res.json();

        if (!response.error) {
          const loginResponse = await fetch('http://localhost:3008/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: formData.username, password: formData.password}),
          });

          const data = await loginResponse.json();
          if (!data.error) {
            // Successful login, redirect to courses
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
            setCookie('token', data.data);
            setIsAuthenticated(true);
            setCurrentUser(jwtDecode(data.data));
            navigate('/courses');
          } else {
            toast.error(data.error, {
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
            setIsAuthenticated(false);
          }

        } else {
          toast.error(response.error, {
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
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again.', {
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
    }


  }

}


  return (
    <>
      <Box sx={{ width: "80%", margin: "100px auto" }}>
        <h4>Create New Account</h4>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <TextField
              label="User Name"
              name="username"
              fullWidth
              type="text"
              value={formData.username}
              onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
              }
              required
              InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Username must be at least 4 characters, all lowercase, allow only an underscore as
                       a special character, can include numbers but must include at least one character.">
                        <IconButton edge="end">
                          <InfoOutlined />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                ),
              }}
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
          {/* Email Field */}
          <TextField
            label="Email"
            name="email"
            fullWidth
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
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
          {/* Password Field with Info Icon */}
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
                required
                value={formData.password}
                onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                }
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <Tooltip title="Password must be at least 8 characters long, include a number, a special character, an uppercase letter and a lowercase letter.">
                      <IconButton edge="end">
                        <InfoOutlined />
                      </IconButton>
                    </Tooltip>
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

          {/* Confirm Password Field */}
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
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
                name="confirmpassword"
                required
                value={formData.confirmpassword}
                onChange={(e) =>
                    setFormData({ ...formData, confirmpassword: e.target.value })
                }
                type={showPassword2 ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                        onClick={handleClickShowPassword2}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                    >
                      {showPassword2 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Gender</FormLabel>
            <RadioGroup value={genderValue} onChange={handleGenderChange}>
              <Box display="flex" flexDirection="row">
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
              </Box>
            </RadioGroup>
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
            to="/login"
            variant="body2"
            className="blue-text"
            style={{ display: "block", marginTop: "1rem" }}
          >
            Have an account? Sign in
          </NavLink>
        </form>
      </Box>
    </>
  );
}

export default SignUp;
