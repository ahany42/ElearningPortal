import { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Box,
} from '@mui/material';
const steps = ['Exam Info', 'Add Questions'];
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
          {steps.map((label,index) => (
            <Step key={label}>
              <StepLabel
            StepIconComponent={(props) => (
              <div
                style={{
                  backgroundColor: props.completed
                    ? '#274546' 
                    : props.active
                    ? '#274546' 
                    : 'gray', 
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff', 
                }}
              >
                {index+1}
              </div>
            )}
          >
            {label}
          </StepLabel>
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
