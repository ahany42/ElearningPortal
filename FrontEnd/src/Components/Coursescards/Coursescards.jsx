import {useContext, useEffect, useRef, useState} from 'react'
import { CurrentUserContext } from "../../App.jsx";
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
import {ToastContainer} from "react-toastify";
import EditCourseForm from "../EditCourseForm/EditCourseForm.jsx";

const CoursesCards = ({ courses, addCourseHandler}) => {
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [coursesList, setCoursesList] = useState([]);
    const CardsContainer = useRef(null);
    const [filter, setFilter] = useState("");
    const [courseEdit, setCourseEdit] = useState({});
    const { currentUser } = useContext(CurrentUserContext);

    const filterHandler = (filter) => {
        const filteredCourses = courses.filter(course => course.title.toLowerCase().includes(filter.toLowerCase()));
        setCoursesList(filteredCourses);
    }

    useEffect(() => {
        setCoursesList(courses);
    }, [courses]);

    useEffect(() => {
        if (showForm || showEditForm) {
            CardsContainer.current.style.opacity = '0.3';
            CardsContainer.current.style.pointerEvents = 'none';
            CardsContainer.current.style.userSelect = 'none';
        } else {
            CardsContainer.current.style.opacity = '1';
            CardsContainer.current.style.pointerEvents = '';
            CardsContainer.current.style.userSelect = '';
        }
    }, [showForm, showEditForm]);

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

    const showEditFormHandler = () => {
        setShowEditForm(!showEditForm);
    };

    return (
      <>
        {
            showForm && (
                <AddCourseForm addHandler={addCourseHandler}
                               showFormHandler={showFormHandler} />
            )
        }
        {
            showEditForm && (
                <EditCourseForm {...courseEdit}
                               showEditFormHandler={showEditFormHandler} />
            )
        }
          <span ref={CardsContainer}>
              <div className="d-flex position-relative mt-5 mb-5 justify-content-center align-items-center">
                 <SearchBar setFilter={setFilter}/>
                 {
                     currentUser.role && ((currentUser.role === "Admin") || (currentUser.role === "SuperAdmin")) &&
                     <button className="AddButton" onClick={showFormHandler}>
                         <FontAwesomeIcon icon={faPlus} title="Add Course"/>
                         Add Course
                     </button>
                 }
              </div>
              <div className="cards pb-5 pt-3">
                  {
                      !coursesList.length && <Placeholder text="No Courses Exists" img={NoCoursesImg}/>
                  }
                  {
                      coursesList.map(course => (
                        <CourseCard setCourseEdit={setCourseEdit} showEditFormHandler={showEditFormHandler}
                                    showFormHandler={showFormHandler} key={v4()} {...course} />
                      ))
                  }
              </div>
          </span>
      </>
    );
};

export default CoursesCards
