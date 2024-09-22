import React from 'react'
import './CourseCard.css'
import ReactImg from '../../assets/React.png';
import { faEdit,faTrash,faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const CourseCard = ({ id, title, desc, hours, isAuthenticated}) => {
    const EditCourse = ()=>{
    toast("Edit Coming Soon");
    }
    const DeleteCourse = ()=>{
        toast ("Delete Coming Soon");
    }
    const CourseDetails = ()=>{
        toast("Course Details Coming Soon");
    }
    const EnrollCourse = ()=>{
        toast("Enroll Coming Soon");
    }
//    for testing only
    const role ="Student";
    //for testing
    const isEnrolled = true;
    // if (isAuthenticated) {
    //for testing
    if(true){
        if(role === "Student"){
            return (
                <div className="card" key={id}>
                <div className="card-header">
                <img src={ReactImg} alt="Course"/>
                <div className="course-icons">
                <button className="enroll-button bold-text blue-text" onClick={EnrollCourse}>{isEnrolled? "Enrolled" : "Enroll"}</button>
               </div>
                <div className="cardButton-container">
                    <button className="course-details bold-text" onClick={CourseDetails}>Course Details</button>
                </div>
                </div>
                <div className="card-body">
                <h5 className="pascalCase-text bold-text">{title}</h5>
                <p>
                 {desc}
                </p>
                <div className="card-bottom">
                <div>
                {hours} Hours
                </div> 
                <div className="alignCenter-text">
                20 <FontAwesomeIcon icon={faUser} />
                </div>
                </div>
                </div>
            
            </div>
            )
            
        }
        else if (role === "Instructor"){
            return(
            <div className="card" key={id}>
            <div className="card-header">
            <img src={ReactImg} alt="Course"/>
            <div className="cardButton-container">
                <button className="course-details bold-text" onClick={CourseDetails}>Course Details</button>
            </div>
            </div>
            <div className="card-body">
            <h5 className="pascalCase-text bold-text">{title}</h5>
            <p>
             {desc}
            </p>
            <div className="card-bottom">
            <div>
            {hours} Hours
            </div> 
            <div className="alignCenter-text">
            20 <FontAwesomeIcon icon={faUser} />
            </div>
            </div>
            </div>
            </div>
            )
        }
        //SuperAdmin and Admin
        else return(
            <div className="card" key={id}>
            <div className="card-header">
            <img src={ReactImg} alt="Course"/>
            <div className="course-icons">
             <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={EditCourse}/>
             <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} onClick={DeleteCourse}/>
            </div>
            <div className="cardButton-container">
                <button className="course-details bold-text" onClick={CourseDetails}>Course Details</button>
            </div>
            </div>
            <div className="card-body">
            <h5 className="pascalCase-text bold-text">{title}</h5>
            <p>
             {desc}
            </p>
            <div className="card-bottom">
            <div>
            {hours} Hours
            </div> 
            <div className="alignCenter-text">
            20 <FontAwesomeIcon icon={faUser} />
            </div>
            </div>
            </div>
        
        </div>
        )
       
    } 
    //Guest User View
    else {
      return (
        <div className="myCard" key={id}>
        <h4 className="pascalCase-text bold-text">{title}</h4>
        <FontAwesomeIcon icon={faEdit} onClick={EditCourse}/>          
        <FontAwesomeIcon icon={faTrash} onClick={DeleteCourse} style={{ color: 'red' }}/> 
            <ul>
                <li>{desc}</li>
                <li>{hours} Hours</li>
            </ul>
            <i title='Exams' className="examIcon fa-solid fa-file-lines"></i>
            <i title='Solved Assignments' className="fa-solid fa-folder"></i>
            <i title='Assignments' className="fa-solid fa-list-check"></i>
        </div>
       )
    }
};

export default CourseCard
