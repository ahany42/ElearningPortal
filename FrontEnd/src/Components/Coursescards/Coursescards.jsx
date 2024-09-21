import {useEffect, useRef, useState} from 'react'
import {useNavigate} from "react-router-dom";
import CourseCard from '../CourseCard/CourseCard';
import AddCourseForm from '../addCourseForm/AddCourseForm';
import Placeholder from '../Placeholder/Placeholder';
import SearchBar from '../Search-MUI/Search-MUI';
import NoCoursesImg from '../../assets/Student.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './Coursescards.css'

const CoursesCards = ({ courses, addCourseHandler ,filterHandler, setFilter}) => {
    const [showForm, setShowForm] = useState(false);
    const [coursesList, setCoursesList] = useState([]);
    const CardsContainer = useRef(null);
    const navigate = useNavigate();

    
    useEffect(() => {
      setCoursesList(courses);
        if (showForm) {
          CardsContainer.current.style.display = 'none';
          CardsContainer.current.style.pointerEvents = 'none';
          CardsContainer.current.style.userSelect = 'none';
        } else {
          CardsContainer.current.style.display = 'block';
          CardsContainer.current.style.pointerEvents = '';
          CardsContainer.current.style.userSelect = '';
        }
    }, [showForm]);

    const showFormHandler = () => {
      setShowForm(!showForm);
    };
    return (
      <>
        {showForm && (
          <AddCourseForm
            addHandler={addCourseHandler}
            showFormHandler={showFormHandler}
          />
        )}
          <span ref={CardsContainer}>
          <div className="d-flex position-relative mt-5 mb-5 justify-content-center">
          <SearchBar setFilter={setFilter}/>
           </div>
          <div className="ButtonContainer">
       <button className="AddButton green-bg light-text" onClick={showFormHandler}>
            <FontAwesomeIcon icon={faPlus} title="Add Course"/>
              Add Course
                </button>
                </div>
          <div className="cards mb-3">
              {
                  !coursesList.length && <Placeholder text="No Courses Exists" img={NoCoursesImg}/>
              }
             {Array.isArray(coursesList) && coursesList.length && coursesList.map(course => (
            <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </span>
      </>
    );
};

export default CoursesCards
