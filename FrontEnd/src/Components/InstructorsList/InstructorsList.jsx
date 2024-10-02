import { useParams } from 'react-router';
import UserCard from '../UserCard/UserCard';
import { useContext } from 'react';
import Placeholder from '../Placeholder/Placeholder.jsx';
import NoInstructorsImg from '../../assets/Instructor.svg';
import { CurrentUserContext } from "../../App.jsx";
const InstructorsList = () => {

    const { instructorsList } = useContext(CurrentUserContext);
    const {id} = useParams();
    return (
    <>
     <h5 className="sub-title">{instructorsList.length} Course Instructors: </h5>
    { !instructorsList.length && <Placeholder text="No Instructors Added" img={NoInstructorsImg}/>}
      {instructorsList.map(instructor=>(
      <UserCard isStudent={false} instructor={instructor} key={instructor.id} student={false}/>
     ))} 
    </>
  )
}

export default InstructorsList
