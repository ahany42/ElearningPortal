import {
    Button,
    Box,
  } from '@mui/material';
import './AddExam.css';
const AddQuestions = ({ handleBack, formData, setFormData }) => {
    return (
      <>
      <Box sx={{width: '80%', margin: '80px auto'}}>

        <Button variant="contained" className="stepper-button stepper-back-button" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" className="stepper-button" onClick={() => alert(JSON.stringify(formData))}>
          Submit
        </Button>
      </Box>
      </>
    );
  };
  
  export default AddQuestions;