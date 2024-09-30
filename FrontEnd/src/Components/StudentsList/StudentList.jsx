import { useParams } from 'react-router';
import UserCard from '../UserCard/UserCard';
const StudentList = () => {
    const {id} = useParams();
  return (
    <>
     <h5 className="sub-title">Enrolled Students: </h5>
     <UserCard isStudent={true}/>
     <UserCard isStudent={true}/>
     <UserCard isStudent={true}/>
     <UserCard isStudent={true}/>
     <UserCard isStudent={true}/>
     <UserCard isStudent={true}/>
     <UserCard isStudent={true}/>
     <UserCard isStudent={true}/>
     <UserCard isStudent={true}/>
     <UserCard isStudent={true}/>
     <UserCard isStudent={true}/>
    </>
  )
}

export default StudentList
