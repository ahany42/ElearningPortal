import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from 'react';
import ReactImg from '../../assets/React.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import { CurrentUserContext } from "../../App.jsx";
import './UserCard.css';
const UserCard = ({isStudent}) => {
  const navigate = useNavigate ();
  const RemoveStudent = ()=>{
    console.log(currentUser);
    alert("Remove Student coming soon");
  }
  const RemoveInstructor = ()=>{
    alert("Remove Instructor coming soon");
  }
  const ViewProgress = ()=>{
    navigate(`/ViewProgress/${studentId}`)
  }
  const { currentUser, isAuthenticated, setCourses } = useContext(CurrentUserContext);
  //for testing
  //studnetId to equal current student id in list of students
  let studentId = 1;
  return (
    <div className=" card user-card ">
    <div className=" user-sub-card">
      <img src={ReactImg} alt="user" className="user-list-user-avatar"/>
        <div className="user-details-container">
            <div className="user-details">
            <h6>
              Aly Hany
            </h6>
            </div>
            <h6 className="user-name">
                ahany 
            </h6>
        </div>
        
    {((currentUser.role === "Admin")||(currentUser.role === "SuperAdmin"))  && <FontAwesomeIcon className="remove-user-button" icon={faTrash} onClick={isStudent? RemoveStudent : RemoveInstructor} color="red"/>}
    {((currentUser.role === "Student") && (currentUser.id === studentId)) && <button className=" enroll-text enroll-button bold-text blue-text progress-button" onClick={ViewProgress}> My Progress</button>}
    {((currentUser.role === "Instructor") || true )&& <button className=" enroll-text enroll-button bold-text blue-text progress-button" onClick={ViewProgress}> Progress</button>}
    </div>
</div>
  )
}

export default UserCard
