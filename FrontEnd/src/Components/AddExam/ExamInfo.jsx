import {Button,TextField,Box} from "@mui/material";
import { DateTimePicker , LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useContext,useState } from "react";
import { CurrentUserContext } from '../../App';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './AddExam.css';

const ExamInfo = ({ handleNext,id}) => {
    const [sDate, setSDate] = useState(null);
    const [eDate, setEDate] = useState(null);
    const { courses,showMessage } = useContext(CurrentUserContext);
    const currentCourse = courses.find(course=>course.id===id);
    const [formData,setFormData] = useState({
      title:'',
      courseTitle:'',
      duration:'',
      sDate:null,
      eDate:null

    })
    const handleExamInfo = ()=>{
     if(formData.title && formData.courseTitle && formData.duration && formData.sDate && formData.eDate){
      showMessage("Step 1 Added Successfully",false);
      handleNext();
     }
     else{
      console.log(eDate)
      showMessage("Please Fill All Fields",true);
     }
    }
    return (
      <div>
        <Box sx={{ width: "80%", margin: "80px auto" }}>
          <h4 className="mb-3">Exam Info</h4>
          <form onSubmit={handleExamInfo}>
            <TextField
              label="Exam Title"
              name="title"
              fullWidth
              type="text"
              value={formData.title}
              //  onKeyDown={(e) => handleKeyPress(e, 'title')}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value })
                toast.dismiss();
              }}
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
              label="Course Title"
              name="courseTitle"
              readOnly
              fullWidth
              type="text"
              value={currentCourse.title || "Course Not Available"}
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
              label="Duration"
              name="duration"
              fullWidth
              type="number"
              value={formData.duration}
              //  onKeyDown={(e) => handleKeyPress(e, 'duration')}
              onChange={(e) => {
                setFormData({ ...formData, duration: e.target.value });
                toast.dismiss();
              }}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                my: 2,
                gap: "4em",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Select Start Date"
                  value={sDate}
                  onChange={(newDate) => {
                    setFormData({ ...formData, sDate: newDate });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      x={{
                        my: 2,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "grey ",
                          },
                          "&:hover fieldset": {
                            borderColor: "#274546 !important",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#274546 !important",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          "&.Mui-focused": {
                            color: "#274546 !important",
                          },
                        },
                      }}
                    />
                  )}
                  InputProps={{ sx: {} }}
                  PopperProps={{ sx: {} }}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Select End Date"
                  value={eDate}
                  onChange={(newDate) => {
                    setFormData({ ...formData, eDate: newDate });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      x={{
                        my: 2,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "grey ",
                          },
                          "&:hover fieldset": {
                            borderColor: "#274546 !important",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#274546 !important",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          "&.Mui-focused": {
                            color: "#274546 !important",
                          },
                        },
                      }}
                    />
                  )}
                  InputProps={{ sx: {} }}
                  PopperProps={{ sx: {} }}
                />
              </LocalizationProvider>
            </Box>
          </form>
          <Button
            variant="contained"
            onClick={handleExamInfo}
            className="stepper-button pascalCase-text"
            style={{ background: "#2d3480 !important" }}
          >
            Next
          </Button>
        </Box>
      </div>
    );
};
export default ExamInfo
