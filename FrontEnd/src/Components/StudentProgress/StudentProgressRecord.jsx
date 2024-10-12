import './StudentProgress.css';
const StudentProgressRecord = ({record}) => {
  return (
    <tr>
            <td>
                {record.course}
            </td>
            <td>
               {record.title}
            </td>
            <td>
              {record.deadline}
            </td>
            <td>
           <h6 className = {record.isSubmitted? "on-time bold-text blue-text":"late bold-text"}>{record.isSubmitted? "Yes" : "No"}</h6>
            </td>
            <td>
             {record.isExam? record.grade : "-"}
            </td>
            </tr>
  )
}

export default StudentProgressRecord
