import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router';
import { CurrentUserContext } from "../../App.jsx";
import './UserCard.css';
import { getCookie } from "../Cookie/Cookie.jsx";
import Front_ENV from "../../../Front_ENV.jsx";

const UserCard = ({isStudent , student, instructor, updateList, setUpdateList}) => {
  const { currentUser, showMessage, confirmationToast } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const RemoveStudent = async () => {
      const isConfirmed = await confirmationToast("Are You Sure You Want to remove student?");
      if (isConfirmed) {
          const response = await fetch(`${Front_ENV.Back_Origin}/unenroll-course`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'authorization': getCookie("token") || ""
              },
              body: JSON.stringify({
                  userId: student.id,
                  courseId: id
              })
          })
              .then(response => response.json());

          if (response.error) {
              showMessage(response.error, true);
          } else {
              setUpdateList(!updateList);
              showMessage(response.message, false);
          }
      }
  }

  const RemoveInstructor = async () => {
      const isConfirmed = await confirmationToast("Are You Sure You Want to remove instructor?");
      if (isConfirmed) {
          const response = await fetch(`${Front_ENV.Back_Origin}/unenroll-course`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'authorization': getCookie("token") || ""
              },
              body: JSON.stringify({
                  userId: instructor.id,
                  courseId: id
              })
          })
              .then(response => response.json());

          if (response.error) {
              showMessage(response.error, true);
          } else {
              setUpdateList(!updateList);
              showMessage(response.message, false);
          }
      }
  }

  const ViewProgress = ()=>{
    navigate(`/ViewProgress/${student.id}/${student.name}`)
  }

  return (
    <div className=" card user-card card-shadow ">
    <div className=" user-sub-card">
      <img src={`https://ui-avatars.com/api/?background=2d3480&color=`+
                           `fb8928&rounded=true&name=${currentUser.name}`} alt="user" className="user-list-user-avatar"/>
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

        {
            ((currentUser.role === "Admin")||(currentUser.role === "SuperAdmin")) &&
                <FontAwesomeIcon className="remove-user-button" icon={faTrash}
                                 onClick={isStudent? RemoveStudent : RemoveInstructor} color="red"/>
        }
        {
            ((currentUser.role === "Student") && isStudent && (currentUser.id === student.id)) &&
                <button className=" enroll-text enroll-button bold-text blue-text progress-button"
                        onClick={ViewProgress}>
                    My Progress
                </button>
        }
        {
            ((currentUser.role === "Instructor") && isStudent) &&
                <button className=" enroll-text enroll-button bold-text blue-text progress-button"
                        onClick={ViewProgress}>
                    Progress
                </button>
        }
        {
            (currentUser.role === "Admin" || currentUser.role === "SuperAdmin") &&
                <button className=" enroll-text enroll-button bold-text blue-text progress-button"
                        onClick={ViewProgress}>
                    Progress
                </button>
        }
    </div>
</div>
  )
}

export default UserCard