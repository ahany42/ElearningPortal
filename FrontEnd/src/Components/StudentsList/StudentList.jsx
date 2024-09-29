import { useParams } from 'react-router';
import UserCard from '../UserCard/UserCard';
import './StudentList.css';
const StudentList = () => {
    const {id} = useParams();
  return (
    <>
     <h5 className="sub-title">Enrolled Students: </h5>
     <UserCard/>
     <UserCard/>
     <UserCard/>
     <UserCard/>
     <UserCard/>
     <UserCard/>
     <UserCard/>
     <UserCard/>
    </>
  )
}

export default StudentList
