import { useParams } from 'react-router';
import UserCard from '../UserCard/UserCard';
import { useContext } from 'react';
import { CurrentUserContext } from "../../App.jsx";
const StudentList = () => {
  //course id
    const {id} = useParams();
    const { studentList } = useContext(CurrentUserContext);
  
   return(
    <>
     <h5 className="sub-title">Enrolled Students: </h5>
     {studentList.map(student=>(
      <UserCard isStudent={true} student={student} key={student.id}/>  ))}
    </>
   )
}

export default StudentList
