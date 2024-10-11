import Image from "../../assets/Course_Placeholder.svg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import { CurrentUserContext } from "../../App.jsx";
import './UserCard.css';

const UserCard = ({isStudent , student,instructor}) => {
  const { currentUser} = useContext(CurrentUserContext);
  const navigate = useNavigate ();
  const RemoveStudent = ()=>{
    alert("Remove Student coming soon");
  }
  const RemoveInstructor = ()=>{
    alert("Remove Instructor coming soon");
  }
  const ViewProgress = ()=>{
    navigate(`/ViewProgress/${student.id}`)
  }
  return (
    <div className=" card user-card card-shadow ">
    <div className=" user-sub-card">
      <img src={Image} alt="user" className="user-list-user-avatar"/>
        <div className="user-details-container">
            <div className="user-details">
            <h6>
              {isStudent? student.name:instructor.name}
            </h6>
            </div>
            <h6 className="user-name">
            {isStudent? student.username:instructor.username}
            </h6>
        </div>

    {((currentUser.role === "Admin")||(currentUser.role === "SuperAdmin"))  && <FontAwesomeIcon className="remove-user-button" icon={faTrash} onClick={isStudent? RemoveStudent : RemoveInstructor} color="red"/>}
    {((currentUser.role === "Student") && (currentUser.id === student.id)) && <button className=" enroll-text enroll-button bold-text blue-text progress-button" onClick={ViewProgress}> My Progress</button>}
    {((currentUser.role === "Instructor") && isStudent )&& <button className=" enroll-text enroll-button bold-text blue-text progress-button" onClick={ViewProgress}> Progress</button>}
    </div>
</div>
  )
}

export default UserCard