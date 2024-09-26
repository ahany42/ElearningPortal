import { useEffect, useContext, useState } from 'react';
import { useParams } from "react-router";
import ReactImg from '../../assets/React.png';
import { faUser,faChalkboardTeacher, faFileAlt, faClock} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CourseDetails.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { CurrentUserContext } from '../../App';
import {toast} from "react-toastify";

const CourseDetails = () => {
    const {id} = useParams();
    const { courses } = useContext(CurrentUserContext);
    const [ _, setMsgsList ] = useState([]);

    const EnrollCourse = (courseID) => {
        setMsgsList(  (prevState) => {
            if (!prevState.includes(courseID)) {
                setTimeout(() => {
                    toast.success(`Course (${courseID}) Enrolled Successfully`, {
                        autoClose: 1500,
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
                            setMsgsList(prevState.filter(m => m !== courseID));
                        }
                    });
                }, 0)
                return [...prevState, courseID];
            }
            return prevState;
        });
    }

    //for testing
    const isEnrolled = false;

    const course = courses.find(course => course.id === id);

    return (
      <>
          {
              course ? (
                  <div className="card course-cover">
                      <div className="card-header details-header">
                          <h3 className="course-title alignLeft-text bold-text">{course.title}</h3>
                          <img src={ReactImg} alt="Course Photo"/>
                          <div className="course-stats">
                              <h6 className="stats">3 <FontAwesomeIcon icon={faClock}/></h6>
                              <h6 className="stats">20 <FontAwesomeIcon icon={faUser}/></h6>
                              <h6 className="stats">3 <FontAwesomeIcon icon={faChalkboardTeacher}/></h6>
                              <h6 className="stats">3 <FontAwesomeIcon icon={faFileAlt}/></h6>
                          </div>
                          {
                              !isEnrolled? (
                                  <button className="enroll-button bold-text blue-text"
                                          onClick={()=>EnrollCourse(course.id)}>
                                      Enroll
                                  </button>
                              ) : (
                                  <p className="blue-text bold-text" style={{height: 'fit-content'}}>
                                      Enrolled
                                  </p>
                              )
                          }
                          <h5 className="course-description">{course.desc}</h5>
                      </div>
                  </div>
              ) : (
                    <h1 className="text-center">Course not found</h1>
                )
          }
      </>
    )
}

export default CourseDetails
