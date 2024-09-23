import React from 'react'
import './CourseCard.css'
import ReactImg from '../../assets/React.png';
import CoursePlaceholder from '../../assets/Student.svg';
import { faEdit,faTrash,faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const CourseCard = ({ id, title, desc, hours, isAuthenticated}) => {
    const navigate = useNavigate();
    const EditCourse = ()=>{
    toast("Edit Coming Soon");
    }
    const DeleteCourse = ()=>{
        toast ("Delete Coming Soon");
    }
    const CourseDetails = ()=>{
        navigate(`/CourseDetails/${id}`)
    }
    const EnrollCourse = (role)=>{
       if(role){
           //Logic for all users
       }
       else{
        //logic for guest user
       }
        
    }
//    for testing only
    const role ="Student";
    //for testing
    const isEnrolled = false;
    if (isAuthenticated) {
        if(role === "Student"){
            return (
                <div className="card" key={id}>
                <div className="card-header">
                <img src={ReactImg || CoursePlaceholder} alt="Course"/>
                <div className="course-icons">
                {!isEnrolled? (<button className="enroll-button bold-text blue-text" onClick={EnrollCourse}>Enroll</button>):(<p className="blue-text bold-text">Enrolled</p>)}
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
            <img src={ReactImg || CoursePlaceholder} alt="Course"/>
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
            <img src={ReactImg || CoursePlaceholder} alt="Course"/>
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
        <div className="card" key={id}>
                <div className="card-header">
                <img src={ReactImg || CoursePlaceholder} alt="Course"/>
                <div className="course-icons">
                <button className="enroll-button bold-text blue-text" onClick={EnrollCourse}>Enroll</button>
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
};

export default CourseCard
