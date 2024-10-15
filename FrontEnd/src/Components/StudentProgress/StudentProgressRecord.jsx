import './StudentProgress.css';
import {useNavigate} from "react-router";
import {useContext} from "react";
import {CurrentUserContext} from "../../App.jsx";

const StudentProgressRecord = ({record, courseName, highlighted}) => {
    const navigate = useNavigate();
    const { courses } = useContext(CurrentUserContext);

    return (
        <tr style={ highlighted? { background: "yellow" } : {} }
            onMouseEnter={(e) => {
                if (e.target.tagName === "TD") {
                    e.target.parentElement.style.background = "yellow";
                } else {
                    e.target.style.background = "yellow";
                }
            }}
            onMouseLeave={(e) => {
                if (e.target.tagName === "TD") {
                    e.target.parentElement.style.background = "";
                } else {
                    e.target.style.background = "";
                }
            }}>
            <td className="stud-prog-hover-cell" style={{ paddingLeft: "15px" }}>
                <span onClick={() => {
                    navigate(`/CourseDetails/${courses.find(c => c.title === courseName).id}`)
                }}>
                    {courseName}
                </span>
            </td>
            <td className="stud-prog-hover-cell">
                <span onClick={() => {
                    record.isExam?
                        navigate("/ExamPage", {
                            state: { eid: record.id },
                        })
                    :
                        navigate("/AssignmentPage", {
                            state: { aid: record.id },
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
            <td>
                {(record.isSubmitted) && !isNaN(record.grade) ?
                    parseFloat(record.grade).toFixed(2) : "-"}
            </td>
        </tr>
    )
}

export default StudentProgressRecord
