import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, FormControl, TextField, Box } from "@mui/material";
import axios from "axios";
import { NavLink } from "react-router-dom";
const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [_, setMessagesList] = useState([]);

  // const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3008/forgotpassword",
        JSON.stringify(formData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.data.error) {
        setMessagesList((prevMessagesList) => {
          if (!prevMessagesList.includes(response.data.message)) {
            toast.success(response.data.message, {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              style: {
                userSelect: "none",
                gap: "10px",
                padding: "20px",
              },

              onClose: () => {
                setMessagesList((prevState) =>
                  prevState.filter((e) => e !== response.data.message)
                );
              },
            });
            // navigate("/ChangePassword");
            return [...prevMessagesList, response.data.message];
          } else {
            return prevMessagesList;
          }
        });
      } else {
        setMessagesList((prevMessagesList) => {
          if (!prevMessagesList.includes(response.data.error)) {
            toast.error(response.data.error, {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              style: {
                userSelect: "none",
                gap: "10px",
                padding: "20px",
              },
              onClose: () => {
                setMessagesList((prevState) =>
                  prevState.filter((e) => e !== response.data.error)
                );
              },
            });
            return [...prevMessagesList, response.data.error];
          } else {
            return prevMessagesList;
          }
        });
      }
    } catch (error) {
      toast.warn("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Box sx={{ width: "80%", margin: "80px auto" }}>
        <h4>Reset Your Password</h4>
        <form onSubmit={handleSubmit}>
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
          ></FormControl>
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
            to="/login"
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
