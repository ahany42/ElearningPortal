import {Button,Box} from "@mui/material";
import { useContext,useState } from "react";
import Question from "../Question/Question";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CurrentUserContext } from '../../App';
import './AddExam.css';
const AddQuestions = ({ handleBack,id }) => {
  const { courses,showMessage } = useContext(CurrentUserContext);
  const currentCourse = courses.find(course=>course.id===id);
  const handleSubmit = ()=>{

  }
  const areChoicesUnique = (choice1, choice2, choice3, choice4) => {
    const choices = [choice1, choice2, choice3, choice4];
    const uniqueChoices = new Set(choices); 
    return uniqueChoices.size === choices.length; 
  }
  const handleAddQuestion = ()=>{
    if(formData.title && formData.answer1 && formData.answer2 && formData.answer3 && formData.answer4 && formData.correctAnswer){
      const allUnique = areChoicesUnique(formData.answer1,formData.answer2,formData.answer3,formData.answer4);
      if (!allUnique) {
        showMessage("Choices Are Not Unique",true);
      } else {
        showMessage("Choices Are Unique add Question coming soon",false);

      }
    
    }
    else{
      showMessage("Please fill all fields",true);

    }
  }
  const [formData,setFormData] = useState({
    title:'',
    answer1:'',
    answer2:'',
    answer3:'',
    answer4:'',
    correctAnswer:null
  })
 
    return (
      <>
      <Box sx={{width: '80%', margin: '80px auto'}}>
      <h4 className="mb-3">Exam Questions</h4>
      <form onSubmit={handleSubmit}>
       <Question formData={formData} setFormData={setFormData} />
          </form>
          <button className="add-question-button AddButton" onClick={handleAddQuestion}>
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