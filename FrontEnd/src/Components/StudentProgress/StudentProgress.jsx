import { useParams } from 'react-router';
import StudentProgressRecord from './StudentProgressRecord';
import { useContext } from 'react';
import { CurrentUserContext } from "../../App.jsx";
import Placeholder from '../Placeholder/Placeholder.jsx';
import CaughtUp from '../../assets/Grades.svg';
import './StudentProgress.css';
const StudentProgress = () => {
const {id} = useParams();
const {progress} = useContext(CurrentUserContext);
  return (
    <>
    <h5 className="alignCenter-text">Aly Hany's Progress in React Js</h5>
        <table className="student-progress-table">
            <th>Exam/Assignment</th>
            <th>Submission Date</th>
            <th>DeadLine</th>
            <th>On Time</th>
            <th>Grade</th>
            {!progress.length &&  <Placeholder text="You're all caught up" img={CaughtUp}/>}
           {progress.map(record=>(
            <StudentProgressRecord key={record.id} record={record}/>
           ))}
        </table>
    </>
  )
}

export default StudentProgress
