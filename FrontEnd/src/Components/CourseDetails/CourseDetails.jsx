import { useEffect, useContext } from 'react';
import { useParams } from "react-router";
import ReactImg from '../../assets/React.png';
import { faEdit,faTrash,faUser,faChalkboardTeacher, faFileAlt} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CourseDetails.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { CurrentUserContext } from '../../App';

const CourseDetails = () => {
    const {id} = useParams();
    const { courses } = useContext(CurrentUserContext);
    
    //for testing
    const isEnrolled = true;

    const course = courses.find(course => course.id === id);


    return (
      <>
          {
              course ? (
                  <div className="card course-cover">
                      <div className="card-header details-header">
                          <h3 className="course-title alignLeft-text">{course.title}</h3>
                          <img src={ReactImg} alt="Course Photo"/>
                          <div className="course-stats">
                              <h6 className="stats">{course.hours} <AccessTimeOutlinedIcon fontSize="large" /></h6>
                              <h6 className="stats">20 <FontAwesomeIcon icon={faUser}/></h6>
                              <h6 className="stats">3 <FontAwesomeIcon icon={faChalkboardTeacher}/></h6>
                              <h6 className="stats">3 <FontAwesomeIcon icon={faFileAlt}/></h6>
                          </div>
                          {
                              !isEnrolled? (
                                  <button className="enroll-button bold-text blue-text" onClick={()=>EnrollCourse(role)}>
                                      Enroll
                                  </button>
                              ) : (
                                  <p className="blue-text bold-text" style={{height: 'fit-content'}}>
                                      Enrolled
                                  </p>
                              )
                          }
                          <h5 className="course-hours-description">{course.desc}</h5>
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
