import {Button,Box} from "@mui/material";
import { useContext,useState } from "react";
import Question from "../Question/Question";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CurrentUserContext } from '../../App';
import './AddExam.css';
const AddQuestions = ({id }) => {
  const { courses,showMessage } = useContext(CurrentUserContext);
  const currentCourse = courses.find(course=>course.id===id);
  const [questionsList,setQuestionsList] = useState({
    courseTitle:currentCourse.title,
    questions:[],
  }
  );
  const areChoicesUnique = (choice1, choice2, choice3, choice4) => {
    const choices = [choice1, choice2, choice3, choice4];
    const uniqueChoices = new Set(choices); 
    return uniqueChoices.size === choices.length; 
  }
  const handleAddQuestion = (formData)=>{
    if(formData.title && formData.answers[0] && formData.answers[1] && formData.answers[2] && formData.answers[3] && formData.correctAnswer){
      const allUnique = areChoicesUnique(formData.answers[0],formData.answers[1],formData.answers[2],formData.answers[3]);
      if (!allUnique) {
        showMessage("Choices Are Not Unique",true);
        return false;
      } else {
        showMessage("Add Question Coming soon",false);
        return true;
      }
    
    }
    else{
      showMessage("Please fill all fields",true);
      return false;

    }
  }
  const handleSubmit = (formData)=>{
   if(handleAddQuestion(formData)){
     showMessage("Save Form Coming soon",false)
   }
  }
  const [formData,setFormData] = useState({
    title:'',
    answers:['','','',''],
    correctAnswer:'',
  })

    return (
      <>
      <Box sx={{width: '80%', margin: '80px auto'}}>
      <h4 className="mb-3">Exam Questions</h4>
      <form onSubmit={handleSubmit}>
       <Question formData={formData} setFormData={setFormData}/>
          </form>
          <button className="add-question-button AddButton" onClick={()=>handleAddQuestion (formData)}>
            <FontAwesomeIcon icon={faPlus} title="Add Question"/>
             Add Question
            </button>
        <Button variant="contained" className="stepper-button pascalCase-text" onClick = {()=>handleSubmit(formData)} >
          Submit
        </Button>
      </Box>
      </>
    );
  };
  
  export default AddQuestions;