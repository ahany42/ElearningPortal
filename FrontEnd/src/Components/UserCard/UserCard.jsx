import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from 'react';
import ReactImg from '../../assets/React.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CurrentUserContext } from "../../App.jsx";
import './UserCard.css';
const UserCard = () => {
  const RemoveStudent = ()=>{
    alert("coming soon");
  }
  const { currentUser, isAuthenticated, setCourses } = useContext(CurrentUserContext);
  return (
    <div className=" card user-card ">
    <div className=" user-sub-card">
      <img src={ReactImg} alt="user" className="user-list-user-avatar"/>
        <div>
            <div className="user-details">
            <h6>
                Aly Hany
            </h6>
            </div>
            <h6 className="user-name">
                ahany 
            </h6>
        </div>
        
        {((currentUser.role === "Admin")||(currentUser.role === "SuperAdmin")) && <FontAwesomeIcon className="remove-user-button" icon={faTrash} onClick={RemoveStudent} color="red"/>}
            
        
    </div>
</div>
  )
}

export default UserCard
