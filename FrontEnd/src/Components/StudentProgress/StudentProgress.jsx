import { useLocation, useParams, useNavigate } from 'react-router';
import StudentProgressRecord from './StudentProgressRecord';
import { useContext } from 'react';
import { CurrentUserContext } from "../../App.jsx";
import Placeholder from '../Placeholder/Placeholder.jsx';
import CaughtUp from '../../assets/Grades.svg';
import './StudentProgress.css';

const StudentProgress = () => {
    const { progress,currentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();
    let { id } = useParams();
    
    if (!id) {
      id = currentUser.id;
    }

    return (
        <>
            <button
                className="goBackBtn"
                style={{top: "15px", left: "30px"}}
                onClick={() => navigate(`/courses`)}
            >
                <svg
                    height="16"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    viewBox="0 0 1024 1024"
                >
                    <path
                        d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
                </svg>
                <span>Back</span>
            </button>
            <div className="student-progress-container">
                <h5 className="alignCenter-text">{currentUser.name}'s Progress in React Js</h5>
                <table className="student-progress-table">
                    <thead>
                    <tr>
                        <th>Course</th>
                        <th>Exam/Assignment</th>
                        <th>DeadLine</th>
                        <th>Submitted</th>
                        <th>Grade</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        !progress.length &&
                        <Placeholder text="You're all caught up" img={CaughtUp}/>
                    }
                    {
                        progress.map(record => (
                            <StudentProgressRecord key={record.id} record={record}/>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default StudentProgress
