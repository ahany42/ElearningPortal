import {
    Button,
    Typography,
    TextField,
  } from '@mui/material';
import './AddExam.css';
const ExamInfo = ({ handleNext, formData, setFormData }) => {
    return (
        <div>
        <Typography variant="h6">Exam Info</Typography>
        <TextField
            label="Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
        />
        <Button variant="contained" onClick={handleNext}>
            Next
        </Button>
        </div>
    );
};
export default ExamInfo
