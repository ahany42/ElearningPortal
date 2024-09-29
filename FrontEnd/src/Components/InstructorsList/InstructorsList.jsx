import { useParams } from 'react-router';
import UserCard from '../UserCard/UserCard';
const InstructorsList = () => {
    const {id} = useParams();
  return (
    <>
     <h5 className="sub-title">Course Instructors: </h5>
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

export default InstructorsList
