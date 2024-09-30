import { useParams } from 'react-router';
import './StudentProgress.css';
const StudentProgress = () => {
const {id} = useParams();
  return (
    <>
        <h3>Student Progress</h3>
    </>
  )
}

export default StudentProgress
