import {useEffect, useRef, useState} from 'react'
import {useNavigate} from "react-router-dom";
import CourseCard from '../CourseCard/CourseCard';
import AddCourseForm from '../addCourseForm/AddCourseForm';
import Placeholder from '../Placeholder/Placeholder';
import SearchBar from '../Search-MUI/Search-MUI';
import NoCoursesImg from '../../assets/Student.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { v4 } from 'uuid';
import './Coursescards.css'

const CoursesCards = ({ courses, addCourseHandler}) => {
    const [showForm, setShowForm] = useState(false);
    const [coursesList, setCoursesList] = useState([]);
    const CardsContainer = useRef(null);
    const [filter, setFilter] = useState("");
     //for testing
     const role = "Admin";
    const filterHandler = (filter) => {
        const filteredCourses = courses.filter(course => course.title.toLowerCase().includes(filter.toLowerCase()));
        setCoursesList(filteredCourses);
    }

    useEffect(() => {
      setCoursesList(courses);
        if (showForm) {
            CardsContainer.current.style.opacity = '0.3';
            CardsContainer.current.style.pointerEvents = 'none';
            CardsContainer.current.style.userSelect = 'none';
        } else {
            CardsContainer.current.style.opacity = '1';
            CardsContainer.current.style.pointerEvents = '';
            CardsContainer.current.style.userSelect = '';
        }
    }, [showForm]);

    useEffect(() => {
        if (filter) {
            filterHandler(filter);
        } else {
            setCoursesList(courses);
        }
    }, [filter]);

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
          <span ref={CardsContainer} className='mt-5'>
              <div className="d-flex position-relative mt-5 mb-5 justify-content-center align-items-center">
                 <SearchBar setFilter={setFilter}/>
                 {(role==="Admin") || (role==="SuperAdmin") && <button className="AddButton" onClick={showFormHandler}>
                    <FontAwesomeIcon icon={faPlus} title="Add Course"/>
                    Add Course
                </button>}
              </div>
              <div className="cards pb-5 pt-3">
                  {
                      !coursesList.length && <Placeholder text="No Courses Exists" img={NoCoursesImg}/>
                  }
                  {
                      coursesList.map(course => (
                        <CourseCard key={v4()} {...course} />
                      ))
                  }
              </div>
          </span>
      </>
    );
};

export default CoursesCards
