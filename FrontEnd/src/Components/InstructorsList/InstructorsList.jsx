import { useParams } from 'react-router';
import UserCard from '../UserCard/UserCard';
import { useContext } from 'react';
import { CurrentUserContext } from "../../App.jsx";
const InstructorsList = () => {

    const { instructorsList } = useContext(CurrentUserContext);
    const {id} = useParams();
    return (
    <>
     <h5 className="sub-title">Course Instructors: </h5>
     {instructorsList.map(instructor=>(
      <UserCard instructor={instructor}/>
     ))}
    </>
  )
}

export default InstructorsList
