import CoursesCards from '../Coursescards/Coursescards';
import { CurrentUserContext } from "../../App";
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import {toast} from "react-toastify";

const CoursesPage = ({ courses, addCourseHandler, filterHandler, setFilter,enrolled }) => {
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

    // API Call to get courses
    // useEffect(() => {
    //     if (currentUser.id) {
    //         fetch('http://localhost:3008/courses/' + currentUser.id)
    //             .then(res => res.json())
    //             .then(data => {
    //                 if (data.error) {
    //                     showErrors(data.error);
    //                 } else {
    //                     setCoursesList(data.data);
    //                 }
    //             })
    //             .catch(err => {
    //                 showErrors(err);
    //             });
    //     } else {
    //         fetch('http://localhost:3008/courses/none')
    //             .then(res => res.json())
    //             .then(data => {
    //                 if (data.error) {
    //                     showErrors(data.error);
    //                 } else {
    //                     setCoursesList(data.data);
    //                 }
    //             })
    //             .catch(err => {
    //                 showErrors(err);
    //             });
    //     }
    // }, [currentUser]);

    // CHANGE "courses" with "coursesList" in Props for CourseCards, when API is ready
    return (
      <>
          <CoursesCards courses={courses} addCourseHandler={addCourseHandler}
                        filterHandler={filterHandler} setFilter={setFilter} enrolled={enrolled}
          />
      </>
    )
}

export default CoursesPage
