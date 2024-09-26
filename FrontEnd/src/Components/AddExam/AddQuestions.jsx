import {
    Button,
    Typography,
    TextField,
  } from '@mui/material';
import './AddExam.css';
const AddQuestions = ({ handleBack, formData, setFormData }) => {
    return (
      <div>
        {/* to be deleted */}
        <Typography variant="h6">Add Questions</Typography>
        <TextField
          label="Email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          fullWidth
        />
        <Button variant="contained" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" onClick={() => alert(JSON.stringify(formData))}>
          Submit
        </Button>
      </div>
    );
  };
  
  export default AddQuestions;