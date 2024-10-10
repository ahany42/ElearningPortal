import React, {useContext} from 'react';
import { useParams,useNavigate} from "react-router";
import ReactImg from '../../assets/React.png';
import { faUser,faChalkboardTeacher, faFileAlt, faClock} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CourseDetails.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CurrentUserContext } from '../../App';
import CourseMaterial from '../CourseMaterial/CourseMaterial';
import NotFoundImg from '../../assets/404.svg';
import Placeholder from '../Placeholder/Placeholder';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AccessDenied from '../../assets/AccessDenied.svg';
import CaughtUp from '../../assets/Grades.svg';

const CourseDetails = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const { currentUser, showMessage, courses } = useContext(CurrentUserContext);
    //for testing
    const totalExams = 0;
    //for testing
    const totalAssignments = 1;
    //for testing
    const totalAnnouncements = 0;

    const EnrollCourse = (courseID) => {
        showMessage(`Course (${courseID}) Enrolled Successfully`, false);
    }

    const AddMaterial = ()=>{
        navigate(`/AddMaterial/${course.id}`);
    }

    //for testing
    const isEnrolled = false;
    const StudentsList = ()=>{
        navigate(`/CourseDetails/${id}/StudentsList`)
    }

    const InstructorsList = ()=>{
        navigate(`/CourseDetails/${id}/InstructorsList`)
    }

    const course = courses.find(course => course.id === id);

    return (
        course ?
            <>
                {
                    (currentUser.role === "Instructor"  && course.isEnrolled) &&
                    <div className="add-material-button-container">
                        <button className="AddButton add-material" onClick={AddMaterial}>
                            <FontAwesomeIcon icon={faPlus} title="Add Course"/>
                            Add Material
                        </button>
                    </div>
                }
                <button className="goBackBtn" style={{top: "12px", left: "60px"}}
                        onClick={() => navigate(`/courses`)}>
                    <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
                        <path
                            d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
                    </svg>
                    <span>Back</span>
                </button>
                <div className="card course-details card-shadow">
                    {/* check if instructor is teaching this course */}
                    <div className="card-header details-header">
                        <h3 className="course-title alignLeft-text bold-text">{course.title}</h3>
                        <img src={ReactImg} alt="Course Photo"/>
                        <div className="course-stats">
                            <h6 className="stats">3 <FontAwesomeIcon icon={faClock}/></h6>
                            <h6 className="stats stats-button" onClick={StudentsList}>20 <FontAwesomeIcon icon={faUser}/></h6>
                            <h6 className="stats stats-button" onClick={InstructorsList}>3 <FontAwesomeIcon
                                icon={faChalkboardTeacher}/></h6>
                            <h6 className="stats stats-button">3 <FontAwesomeIcon icon={faFileAlt}/></h6>
                        </div>
                        {
                            (currentUser.role === "Student" || currentUser.role === "Instructor" || !currentUser.role) ?
                                !isEnrolled ?
                                    <button className="enroll-button-courseDetails bold-text blue-text"
                                            onClick={() => EnrollCourse(course.id)}>
                                        Enroll
                                    </button> :
                                    <p className="blue-text bold-text" style={{height: 'fit-content'}}>
                                        Enrolled
                                    </p> :
                                null
                        }
                        <h5 className="course-description">{course.desc}</h5>
                    </div>
                    {
                        (currentUser.role && course.isEnrolled) || (currentUser.role==="SuperAdmin" || currentUser.role==="Admin") ?(
                        <div className="course-material card-body">
                            <h5>Added Material:</h5>
                            {
                                (totalAnnouncements + totalAssignments + totalExams !== 0) ?
                                    <div className="material-list">
                                        <CourseMaterial/>
                                    </div> :
                                    <Placeholder text="You're all caught up" img={CaughtUp}/>
                            }
                        </div>):
                         (<Placeholder text="Enroll to course to view Material" img={AccessDenied}/>)
                    }
                </div>
            </>
            :
            <Placeholder text="Course Not Found" img={NotFoundImg}/>

    )
}

export default CourseDetails