import { useParams } from "react-router";
import ReactImg from '../../assets/React.png';
import { faEdit,faTrash,faUser } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CourseDetails.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const CourseDetails = () => {
    const {id} = useParams();
    //for testing
    const isEnrolled = true;
  return (
    <>
      <div className="card course-cover">
        <div className="card-header details-header">
       <h3 className="course-title alignLeft-text">React Js</h3>
       <img src={ReactImg}/>
       <h5 className="course-enrolled-number">20 <FontAwesomeIcon icon={faUser}/></h5>
       {!isEnrolled? (<button className="enroll-button bold-text blue-text" onClick={()=>EnrollCourse(role)}>Enroll</button>):(<p className="blue-text bold-text">Enrolled</p>)}
       <h5 className="course-hours-description">2 Hours Basics of Front-end</h5>
        </div>
      </div>
    </>
  )
}

export default CourseDetails
