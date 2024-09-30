import './StudentProgress.css';
const StudentProgressRecord = ({record}) => {
  return (
    <tr>
            <td>
                {record.title}
            </td>
            <td>
               {record.submissionDate}
            </td>
            <td>
              {record.deadline}
            </td>
            <td>
           <h6 className = {record.onTime? "on-time bold-text blue-text":"late bold-text"}>{record.onTime? "Yes" : "No"}</h6>
            </td>
            <td>
             {record.isExam? record.grade : "-"}
            </td>
            </tr>
  )
}

export default StudentProgressRecord
