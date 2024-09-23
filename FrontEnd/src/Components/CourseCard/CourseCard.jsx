import {useContext, useEffect, useState} from 'react';
import { CurrentUserContext } from "../../App.jsx";
import './CourseCard.css'
import ReactImg from '../../assets/React.png';
import CoursePlaceholder from '../../assets/Student.svg';
import { faEdit,faTrash,faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

let messagesList = [];
let errorList = [];

const CourseCard = ({ id, title, desc, hours}) => {
    const navigate = useNavigate();
    const { currentUser, isAuthenticated } = useContext(CurrentUserContext);

    const showErrors = (error) => {
        if (!errorList.includes(error)) {
            toast.error(error, {
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
                    errorList = errorList.filter(e => e !== error);
                }
            });
            errorList = [...errorList, error];
        }
    }

    const showToast = (msg) => {
        if (!messagesList.includes(msg)) {
            toast(msg, {
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
                    messagesList = messagesList.filter(m => m !== msg);
                }
            });
            messagesList = [...messagesList, msg];
        }
    }

    const EditCourse = ()=>{
        showToast("Edit Coming Soon");
    }

    const DeleteCourse = ()=>{
        showToast ("Delete Coming Soon");
    }

    const CourseDetails = ()=>{
        navigate(`/CourseDetails/${id}`)
    }

    const EnrollCourse = ()=>{
        if (!isAuthenticated) {
            showErrors("Please Login to Enroll")
            navigate('/login');
            return;
        }
        showToast("Enroll Coming Soon");
    }

    // For testing
    const isEnrolled = true; // Will be included in each course object (After API Implementation)

    if (isAuthenticated) { // Authenticated User View
        if(currentUser.role === "Student"){
            return (
                <div className="card" key={id}>
                    <div className="card-header">
                        <img src={ReactImg || CoursePlaceholder} alt="Course"/>
                    </div>
                    <div className="card-body" style={isEnrolled? {position: 'unset'} : {position: 'relative'}}>
                        <div className="card-header-container"
                             style={isEnrolled? {left: '50%', transform: 'translateX(-50%)'} : {}}>
                            <div className="cardButton-container">
                                <button className="enroll-button bold-text"
                                        onClick={CourseDetails}>
                                    Details
                                </button>
                            </div>
                        </div>
                        <div className="course-icons" style={isEnrolled? {top:0, left:0} : {}}>
                            {
                                isEnrolled ? (
                                    <span className="enroll-text bold-text blue-text">
                                        Enrolled
                                    </span>
                                ) : (
                                    <button className="enroll-button bold-text blue-text"
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
                                20 <FontAwesomeIcon icon={faUser}/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (currentUser.role === "Instructor") {
            return (
                <div className="card" key={id}>
                    <div className="card-header">
                        <img src={ReactImg || CoursePlaceholder} alt="Course"/>
                    </div>
                    <div className="card-body" style={isEnrolled ? {position: 'unset'} : {position: 'relative'}}>
                        <div className="card-header-container"
                             style={isEnrolled ? {left: '50%', transform: 'translateX(-50%)'} : {}}>
                            <div className="cardButton-container">
                                <button className="enroll-button bold-text"
                                        onClick={CourseDetails}>
                                    Details
                                </button>
                            </div>
                        </div>
                        <div className="course-icons" style={isEnrolled ? {top: 0, left: 0} : {}}>
                            {
                                isEnrolled ? (
                                    <span className="enroll-text bold-text blue-text">
                                        Enrolled
                                    </span>
                                ) : (
                                    <span className="enroll-text bold-text blue-text">
                                        Not Enrolled
                                    </span>
                                )
                            }
                        </div>
                        <h5 className="pascalCase-text bold-text">{title}</h5>
                        <p>{desc}</p>
                        <div className="card-bottom">
                            <div>{hours} Hours</div>
                            <div className="alignCenter-text">
                                20 <FontAwesomeIcon icon={faUser}/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        // SuperAdmin and Admin
        else return (
            <div className="card" key={id}>
                <div className="card-header position-relative">
                    <img src={ReactImg || CoursePlaceholder} alt="Course"/>
                    <div className="course-icons admin-icons">
                        <FontAwesomeIcon icon={faEdit} style={{cursor: 'pointer'}} className="edit-icon" onClick={EditCourse}/>
                        <FontAwesomeIcon icon={faTrash} style={{color: 'red', cursor: 'pointer'}} onClick={DeleteCourse}/>
                    </div>
                </div>
                <div className="card-body">
                    <div className="card-header-container"
                         style={{left: '50%', transform: 'translateX(-50%)'}}>
                        <div className="cardButton-container">
                            <button className="enroll-button bold-text"
                                    onClick={CourseDetails}>
                                Details
                            </button>
                        </div>
                    </div>
                    <h5 className="pascalCase-text bold-text">{title}</h5>
                    <p>{desc}</p>
                    <div className="card-bottom">
                        <div>{hours} Hours</div>
                        <div className="alignCenter-text">
                                    20 <FontAwesomeIcon icon={faUser}/>
                                </div>
                    </div>
                </div>
            </div>
            )

    } else { // Guest User View (currentUser = {})
        return (
            <div className="card" key={id}>
                <div className="card-header">
                    <img src={ReactImg || CoursePlaceholder} alt="Course"/>
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
                            20 <FontAwesomeIcon icon={faUser}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default CourseCard
