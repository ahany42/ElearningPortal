import {useState} from "react";
import "react-toastify/dist/ReactToastify.css";
import { Button, TextField, Box } from "@mui/material";
const AddAnnouncement = () => {
    const [formData, setFormData] = useState({
        announcementText: "",
      });
    const handleSubmit = ()=>{
        alert("Coming Soon");
    }
  return (
    <div>
    <Box sx={{ width: "80%", margin: "80px auto" }}>
        <h4 className="mb-3">Add Announcement</h4>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Announcement"
            name="announcementText"
            fullWidth
            type="text"
            value={formData.announcementText}
            onChange={(e) =>
              setFormData({ ...formData, announcementText: e.target.value })
            }
            multiline
           rows={2}
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

          <Button
            type="submit"
            variant="contained"
            className="green-bg pascalCase-text"
            fullWidth
            sx={{ my: 2 }}
          >
            Add
          </Button>
          </form>
          </Box>
    </div>
  );
};

export default AddAnnouncement
