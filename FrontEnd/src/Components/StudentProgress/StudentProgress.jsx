import { useLocation, useParams } from 'react-router';
import StudentProgressRecord from './StudentProgressRecord';
import { useContext, useEffect, useState } from 'react';
import { CurrentUserContext } from "../../App.jsx";
import Placeholder from '../Placeholder/Placeholder.jsx';
import CaughtUp from '../../assets/Grades.svg';
import { getCookie } from "../Cookie/Cookie.jsx";
import './StudentProgress.css';

const StudentProgress = () => {
  const { currentUser, showMessage, courses } = useContext(CurrentUserContext);
  const [progress, setProgress] = useState([]);
  const { id } = useParams();
  const { name } = useParams();
  const studentId = id || currentUser.id;

  useEffect(() => {
    const response = fetch(`http://localhost:3008/getStudentProgress?studentID=${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: getCookie("token")
      },
    })
    .then(response => {
      return response.json().then(data => {
        if (response.status === 201) {
          showMessage(response.message, false);
          setProgress(data.data);
        } else {
          showMessage(data.error, true);
        }
      });
    })
  }, [studentId]);

  return (
    <>
      <h5 className="alignCenter-text">{name || currentUser.name}'s Progress in React Js</h5>
      <table className="student-progress-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Exam/Assignment</th>
            <th>Deadline</th>
            <th>Submitted</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {progress.length === 0 ? (
            <tr>
              <td colSpan="5">
                <Placeholder text="You're all caught up" img={CaughtUp} />
              </td>
            </tr>
          ) : (
            progress.map(record => {
              const course = courses.find(course => course.id === record.course);
              return (
                <StudentProgressRecord key={record.id} record={record} courseName={course.title} />
              );
            })
          )}
        </tbody>
      </table>
    </>
  );
}

export default StudentProgress;
