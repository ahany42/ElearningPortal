import CoursesCards from '../Coursescards/Coursescards';
import { CurrentUserContext } from "../../App";
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import {toast} from "react-toastify";

const CoursesPage = ({ courses, addCourseHandler, filterHandler, setFilter, mode }) => {
    // const [coursesList, setCoursesList] = useState([]);
    // const { currentUser } = useContext(CurrentUserContext);
    const [_, setErrorList] = useState([]); // List of errors to show only once (NOT EDITABLE)

    const showErrors = (error) => {
        setErrorList((prevErrorList) => {
            if (error && !prevErrorList.includes(error)) {
                toast.error(error, {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                        userSelect: 'none',
                        gap: '10px',
                        padding: '20px',
                    },
                    onClose: () => {
                        setErrorList(prevState => prevState.filter(e => e !== error))
                    }
                });
                return [...prevErrorList, error];
            } else {
                return prevErrorList;
            }
        });
    }

    // CHANGE "courses" with "coursesList" in Props for CourseCards, when API is ready
    return (
      <>
          <CoursesCards courses={courses} addCourseHandler={addCourseHandler}
                        filterHandler={filterHandler} setFilter={setFilter} mode={mode}
          />
      </>
    )
}

export default CoursesPage
