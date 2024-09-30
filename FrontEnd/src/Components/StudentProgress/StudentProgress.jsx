import { useParams } from 'react-router';
import StudentProgressRecord from './StudentProgressRecord';
import './StudentProgress.css';
const StudentProgress = () => {
const {id} = useParams();
//for testing
const records =[{
    id:1,
    title:"Exam 1",
    isExam:true,
    submissionDate:"30 Sep 9:00",
    deadline:"1 Oct 9:00",
    grade:"30",
    onTime:true,
} ,{
    id:2,
    title:"Assignment 1",
    isExam:false,
    submissionDate:"30 Sep 9:00",
    deadline:"29 Sep 9:00",
    grade:"",
    onTime:false,
}
]  
  return (
    <>
    <h5 className="alignCenter-text">Aly Hany's Progress</h5>
        <table className="student-progress-table">
            <th>Exam/Assignment</th>
            <th>Submission Date</th>
            <th>DeadLine</th>
            <th>On Time</th>
            <th>Grade</th>
           {records.map(record=>(
            <StudentProgressRecord key={record.key} record={record}/>
           ))}
        </table>
    </>
  )
}

export default StudentProgress
