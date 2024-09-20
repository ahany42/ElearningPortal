import {useEffect, useRef, useState} from 'react'
import CourseCard from '../CourseCard/CourseCard';
import './Coursescards.css'
import AddCourseForm from '../addCourseForm/AddCourseForm';
import SearchBar from '../Seach-MUI/Search-MUI';
import {useNavigate} from "react-router-dom";

const CoursesCards = ({ courses, addCourseHandler ,filterHandler, setFilter}) => {
    const [showForm, setShowForm] = useState(false);
    const [coursesList, setCoursesList] = useState([]);
    const CardsContainer = useRef(null);
    const navigate = useNavigate();
    const notify = () => toast("Wow so easy!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
    });

    
    useEffect(() => {
      setCoursesList(courses);
        if (showForm) {
            CardsContainer.current.style.opacity = 0.3;
            CardsContainer.current.style.pointerEvents = 'none';
            CardsContainer.current.style.userSelect = 'none';
        } else {
            CardsContainer.current.style.opacity = 1;
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
            <i
                title="Add Course"
                className="fa-solid fa-plus AddIcon"
                onClick={showFormHandler}
            ></i>
          </div>
          <div className="cards mb-3">
              {
                  !coursesList.length && <h1 className="NoCourses">No Courses Found</h1>
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
