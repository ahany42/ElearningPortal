import './StudentProgress.css';
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import {useContext} from "react";
import {CurrentUserContext} from "../../App.jsx";

const StudentProgressRecord = ({record, courseName, highlighted}) => {
    const navigate = useNavigate();
    const { currentUser,courses } = useContext(CurrentUserContext);

    return (
        <tr style={ highlighted? { background: "yellow", transition: "all 0.1s ease-in-out" }
                    : { transition: "all 0.1s ease-in-out"} }>
            <td className="stud-prog-hover-cell" style={{ paddingLeft: "15px", borderRadius: "20px 0 0 20px" }}>
                <span title="Course Name" onClick={() => {
                    navigate(`/CourseDetails/${courses.find(c => c.title === courseName).id}`, {state: {progress: true}})
                }}>
                    {courseName}
                </span>
            </td>
            <td className="stud-prog-hover-cell">
                <span title={`${record.isExam? "Exam" : "Assignment"} Name`} onClick={() => {
                    record.isExam?
                        navigate("/ExamPage", {
                            state: { eid: record.id, mode: "progress" },
                        })
                    :
                        navigate("/AssignmentPage", {
                            state: { aid: record.id, mode: "progress" },
                        })
                }}>
                    {record.title}
                </span>
            </td>
            <td>
                {record.deadline}
            </td>
            <td>
                <h6 className={record.isSubmitted ? "on-time bold-text blue-text" : "late bold-text"}>{record.isSubmitted ? "Yes" : "No"}</h6>
            </td>
             {currentUser.role === "Instructor" &&
            <td>
                {record.assignmentAnswer?<Link to={`/ViewPdf/${record.assignmentAnswer}/Assignment`}>View</Link>:null}
            </td>}
            <td style={{ borderRadius: "0 20px 20px 0" }}>
                {(record.isSubmitted) && !isNaN(record.grade) ?
                    parseFloat(record.grade).toFixed(2) : "-"}
            </td>
           
        </tr>
    )
}

export default StudentProgressRecord
