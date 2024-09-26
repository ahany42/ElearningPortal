import { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Box,
} from '@mui/material';
const steps = ['Exam Details', 'Add Questions'];
import AddQuestions from './AddQuestions';
import ExamInfo from './ExamInfo';
import './AddExam.css';
const AddExam = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({});
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
  
        <Box sx={{ mt: 2, mb: 2 }}>
          {activeStep === 0 ? (
            <ExamInfo handleNext={handleNext} formData={formData} setFormData={setFormData} />
          ) : (
            <AddQuestions handleBack={handleBack} formData={formData} setFormData={setFormData} />
          )}
        </Box>
      </Box>
    );
}

export default AddExam
