import { useEffect, useContext, useState } from 'react';
import { useParams } from "react-router";
import ReactImg from '../../assets/React.png';
import { faUser,faChalkboardTeacher, faFileAlt, faClock} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CourseDetails.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { CurrentUserContext } from '../../App';
import CourseMaterial from '../CourseMaterial/CourseMaterial';
import {toast} from "react-toastify";
import NotFoundImg from '../../assets/404.svg';
import Placeholder from '../Placeholder/Placeholder';
import CaughtUp from '../../assets/Grades.svg';
const CourseDetails = () => {
    const {id} = useParams();
    const { courses } = useContext(CurrentUserContext);
    const { currentUser } = useContext(CurrentUserContext);
    const [ _, setMsgsList ] = useState([]);
    //for testing
    const courseMaterialType = "announcement";
    //for testing
    const totalExams = 0;
    //for testing
    const totalAssignments = 1;
    //for testing
    const totalAnnouncements = 0;

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
        
      course ?
          <div className="card course-details">
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
                      ( currentUser.role==="Student" || currentUser.role === "Instructor" || currentUser.role === "" ) ?
                          !isEnrolled?
                              <button className="enroll-button bold-text blue-text"
                                      onClick={()=>EnrollCourse(course.id)}>
                                  Enroll
                              </button> :
                              <p className="blue-text bold-text" style={{height: 'fit-content'}}>
                                  Enrolled
                              </p> :
                          null
                  }
                  <h5 className="course-description">{course.desc}</h5>
              </div>

              <div className="course-material card-body">
                  <h5>Added Material:</h5>
                  {
                      ( totalAnnouncements + totalAssignments + totalExams !== 0 ) ?
                          <div className="material-list">
                              <CourseMaterial materialType = {courseMaterialType}/>
                              <CourseMaterial materialType = {courseMaterialType}/>
                              <CourseMaterial materialType = {courseMaterialType}/>
                              <CourseMaterial materialType = {courseMaterialType}/>
                              <CourseMaterial materialType = {courseMaterialType}/>
                              <CourseMaterial materialType = {courseMaterialType}/>
                              <CourseMaterial materialType = {courseMaterialType}/>
                              <CourseMaterial materialType = {courseMaterialType}/>
                          </div> :
                          <Placeholder text="You're all caught up" img={CaughtUp}/>
                  }
              </div>
          </div>
      :
          <Placeholder text="Course Not Found" img={NotFoundImg}/>
    )
}

export default CourseDetails
