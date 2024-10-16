import {Button,Box} from "@mui/material";
import { useContext,useState } from "react";
import Question from "../Question/Question";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CurrentUserContext } from '../../App';
import {getCookie} from "../Cookie/Cookie.jsx";
import './AddExam.css';

const AddQuestions = ({id , examTitle}) => {
  const navigate = useNavigate();
  const { courses,showMessage } = useContext(CurrentUserContext);
  const currentCourse = courses.find(course=>course.id===id);
  const [questionsList,setQuestionsList] = useState({
        examTitle:examTitle,
        questions:[]
      }
  );
  const [questionCount,setQuestionCount] = useState(1);
  const areChoicesUnique = (choice1, choice2, choice3, choice4) => {
    const choices = [choice1, choice2, choice3, choice4];
    const uniqueChoices = new Set(choices);
    return uniqueChoices.size === choices.length;
  }
  const handleAddQuestion = (formData)=>{
    if(formData.title && formData.answers[0] && formData.answers[1] && formData.answers[2] && formData.answers[3] && formData.indexOfCorrectAnswer){
      const allUnique = areChoicesUnique(formData.answers[0],formData.answers[1],formData.answers[2],formData.answers[3]);
      if (!allUnique) {
        showMessage("Choices Are Not Unique",true);
        return false;
      } else {
        setQuestionsList(prevState => ({
          ...prevState,
          questions: [...prevState.questions, formData],
        }));
        setQuestionCount(prevState=>(prevState+=1));
        setFormData("");
        return true;
      }

    }
    else{
      return false;

    }
  }
  const handleSubmit = (formData)=>{
    if(handleAddQuestion(formData)){
      showMessage("Save Form Coming soon",false);
      fetch('http://localhost:3008/addQuestions',{
            method:'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization:getCookie("token")
            },
            body: JSON.stringify(questionsList)
          }
      )
          .then(response => {
            return response.json().then(data => {
              if (response.status === 201) {
                showMessage(data.message, false);
                navigate(`/CourseDetails/${id}`);
                return data;
              } else {
                showMessage(data.error, true);
                throw new Error('Failed to create exam');
              }
            });
          })
          .catch(error => {
            console.error('Error:', error);
          });

    }
  }
  const [formData,setFormData] = useState({
    title:'',
    answers:['','','',''],
    indexOfCorrectAnswer:'',
  })
  return (
      <>
        <Box sx={{width: '80%', margin: '80px auto'}}>
          <h4 className="mb-3">Exam Questions</h4>
          <form onSubmit={handleSubmit}>
            <Question formData={formData} setFormData={setFormData} questionCount={questionCount}/>
          </form>
          <button className="add-question-button AddButton" onClick={()=>handleAddQuestion (formData)}>
            <FontAwesomeIcon icon={faPlus} title="Add Question"/>
            Another Question
          </button>
          <Button variant="contained" className="stepper-button pascalCase-text" onClick = {()=>handleSubmit(formData)} >
            Submit
          </Button>
        </Box>
      </>
  );
};

export default AddQuestions;