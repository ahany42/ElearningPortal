import { useParams } from 'react-router';
import UserCard from '../UserCard/UserCard';
import { useContext } from 'react';
import { CurrentUserContext } from "../../App.jsx";
const StudentList = () => {
  //course id
    const {id} = useParams();
    const { studentsList } = useContext(CurrentUserContext);
  
   return(
    <>
     <h5 className="sub-title">{studentsList.length} Enrolled Students: </h5>
     {studentsList.map(student=>(
      <UserCard isStudent={true} student={student} key={student.id}/>  ))}
    </>
   )
}

export default StudentList
