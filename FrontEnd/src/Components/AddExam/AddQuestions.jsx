import {
  Button,
  Box,
} from "@mui/material";
import { useContext } from "react";
import Question from "../Question/Question";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CurrentUserContext } from '../../App';
import './AddExam.css';
const AddQuestions = ({ handleBack, formData, setFormData,id }) => {
  const { courses } = useContext(CurrentUserContext);
  const currentCourse = courses.find(course=>course.id===id);
  const handleSubmit = ()=>{

  }
 
    return (
      <>
      <Box sx={{width: '80%', margin: '80px auto'}}>
      <h4 className="mb-3">Exam Questions</h4>
      <form onSubmit={handleSubmit}>
       <Question formData={formData} setFormData={setFormData} />
          </form>
          <button className="add-question-button AddButton">
            <FontAwesomeIcon icon={faPlus} title="Add Question"/>
             Add Question
            </button>
        <Button variant="contained" className="stepper-button stepper-back-button pascalCase-text" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" className="stepper-button pascalCase-text" >
          Submit
        </Button>
      </Box>
      </>
    );
  };
  
  export default AddQuestions;