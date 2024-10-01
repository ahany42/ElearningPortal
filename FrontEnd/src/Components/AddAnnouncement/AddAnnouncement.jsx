import {useState} from "react";
import "react-toastify/dist/ReactToastify.css";
import { Button, TextField, Box } from "@mui/material";
import { useParams } from 'react-router';
const AddAnnouncement = ({courses}) => {
    const {id} = useParams();
    const [formData, setFormData] = useState({
        announcementText: "",
      });
    const handleSubmit = ()=>{
        alert("Coming Soon");
    }
    const currentCourse = courses.find(course=>course.id===id);
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
 <TextField label="Course Title"
                   name="courseTitle"
                   readOnly
                   fullWidth type="text" value={currentCourse.title || "Course Not Available"}
                  //  onKeyDown={(e) => handleKeyPress(e, 'courseTitle')}
                  //  onChange={(e) => {
                  //      setFormData({...formData,courseTitle: e.target.value});
                  //      setError('');
                  //      toast.dismiss();
                  //  }}
                  InputProps={{
                    readOnly: true,
                  }}
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
