import 'bootstrap/dist/css/bootstrap.min.css';
import ReactImg from '../../assets/React.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './UserCard.css';
const UserCard = () => {
  const RemoveStudent = ()=>{
    alert("coming soon");
  }
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
        
        <FontAwesomeIcon className="remove-user-button" icon={faTrash} onClick={RemoveStudent} color="red"/>
            
        
    </div>
</div>
  )
}

export default UserCard
