import {useContext, useEffect} from 'react';
import { CurrentUserContext } from "../../App.jsx";
import { faEdit,faTrash,faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CourseCard.css'
import Front_ENV from "../../../Front_ENV.jsx";
import CoursePlaceHolder from "../../assets/Course_Placeholder.svg";

const CourseCard = ({ id, title, image, desc, hours, showEditFormHandler,
                        numStudents, setCourseEdit, isEnrolled, mode }) => {
    const navigate = useNavigate();
    const { currentUser, isAuthenticated, setCourses, showMessage } = useContext(CurrentUserContext);
    const enrolled = mode? true : isEnrolled;

    const EditCourse = (id)=>{
        showEditFormHandler();
        setCourseEdit({id, title, desc, hours});
    }

    const DeleteCourseHandler = (courseId) => {
        setCourses((prevState) =>
            prevState.filter((course) => course.id !== courseId)
        );
        showMessage("Course deleted successfully", false);
    };


    const CourseDetails = ()=>{
        navigate(`/CourseDetails/${id}`)
    }

    const EnrollCourse = ()=>{
        if (!isAuthenticated) {
            showMessage("Please Login to Enroll", true);
            navigate('/login');
            return;
        }
        showMessage("Enroll Coming Soon", null);
    }

    if (isAuthenticated) { // Authenticated User View
        if(currentUser.role === "Student"){
            return (
                <div className="card course-card card-shadow" key={id} style={{minHeight: "405px"}}>
                    <div className="card-header course-card-header-img">
                        <img src={image? `${Front_ENV.Back_Origin}/${image}` : CoursePlaceHolder } alt="Course"/>
                    </div>
                    <div className="card-body" style={enrolled? {position: 'unset'} : {position: 'relative'}}>
                        <div className="card-header-container"
                             style={enrolled? {left: '50%', transform: 'translateX(-50%)'} : {}}>
                            <div className="cardButton-container">
                                <button className="enroll-button bold-text"
                                        onClick={CourseDetails}>
                                    Details
                                </button>
                            </div>
                        </div>
                        <div className="course-icons" style={enrolled? {top:0, left:0} : {}}>
                            {
                                enrolled ? !mode && (
                                    <span className="enroll-text enroll-button bold-text blue-text">
                                        Enrolled
                                    </span>
                                ) : (
                                    <button className=" enroll-text enroll-button bold-text blue-text"
                                            onClick={EnrollCourse}>
                                        Enroll
                                    </button>
                                )
                            }
                        </div>
                        <h5 className="pascalCase-text bold-text">{title}</h5>
                        <p>{desc}</p>
                        <div className="card-bottom">
                            <div>{hours} Hours</div>
                            <div className="alignCenter-text">
                                {numStudents} <FontAwesomeIcon icon={faUser} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else if (currentUser.role === "Instructor") {
            return (
                <div className="card course-card card-shadow" key={id}>
                    <div className="card-header course-card-header-img">
                        <img src={image? `${Front_ENV.Back_Origin}/${image}` : CoursePlaceHolder } alt="Course"/>
                    </div>
                    <div className="card-body" style={{position: 'unset'}}>
                        <div className="card-header-container"
                             style={{left: '50%', transform: 'translateX(-50%)'}}>
                            <div className="cardButton-container">
                                <button className="enroll-button bold-text"
                                        onClick={CourseDetails}>
                                    Details
                                </button>
                            </div>
                        </div>
                        <div className="course-icons" style={{top: 0, left: 0}}>
                            {
                                enrolled ? (
                                    <span className="enroll-text enroll-button bold-text blue-text">
                                    Teaching
                                </span>
                                ) : (
                                    <span className="enroll-text enroll-button bold-text blue-text">
                                        Not Teaching
                                    </span>
                                )
                            }
                        </div>
                        <h5 className="pascalCase-text bold-text">{title}</h5>
                        <p>{desc}</p>
                        <div className="card-bottom">
                            <div>{hours} Hours</div>
                            <div className="alignCenter-text">
                                {numStudents} <FontAwesomeIcon icon={faUser} />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        // SuperAdmin and Admin
        else return (
                <div className="card course-card card-shadow" key={id}>
                    <div className="card-header position-relative course-card-header-img">
                        <img src={image? `${Front_ENV.Back_Origin}/${image}` : CoursePlaceHolder } alt="Course" />
                        <div className="course-icons admin-icons">
                            <FontAwesomeIcon
                                icon={faEdit}
                                style={{ cursor: "pointer" }}
                                className="edit-icon"
                                onClick={() => EditCourse(id)}
                            />
                            <FontAwesomeIcon
                                icon={faTrash}
                                style={{ color: "red", cursor: "pointer" }}
                                onClick={() => DeleteCourseHandler(id)}
                            />
                        </div>
                    </div>
                    <div className="card-body">
                        <h5 className="pascalCase-text bold-text">{title}</h5>
                        <p>{desc}</p>
                        <div className="card-bottom align-items-center">
                            <div>{hours} Hours</div>
                            <div className="card-header-container"
                             style={{left: '50%', transform: 'translateX(-50%)'}}>
                            <div className="cardButton-container">
                                <button className="enroll-button bold-text"
                                        onClick={CourseDetails}>
                                    Details
                                </button>
                            </div>
                        </div>
                            <div className="alignCenter-text">
                                {numStudents} <FontAwesomeIcon icon={faUser} />
                            </div>
                        </div>
                    </div>
                </div>
            );

    } else { // Guest User View (currentUser = {})
        return (
            <div className="card course-card card-shadow" key={id} style={{minHeight: "405px"}}>
                <div className="card-header course-card-header-img">
                    <img src={image? `${Front_ENV.Back_Origin}/${image}` : CoursePlaceHolder } alt="Course"/>
                </div>
                <div className="card-body">
                    <div className="card-header-container">
                        <div className="cardButton-container">
                            <button className="enroll-button bold-text"
                                    onClick={CourseDetails}>
                                Details
                            </button>
                        </div>
                    </div>
                    <div className="course-icons">
                        <button className="enroll-button bold-text blue-text"
                                onClick={EnrollCourse}>
                            Enroll
                        </button>
                    </div>
                    <h5 className="pascalCase-text bold-text">{title}</h5>
                    <p>{desc}</p>
                    <div className="card-bottom">
                        <div>{hours} Hours</div>
                        <div className="alignCenter-text">
                            {numStudents} <FontAwesomeIcon icon={faUser} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default CourseCard