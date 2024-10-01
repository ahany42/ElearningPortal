import 'bootstrap/dist/css/bootstrap.min.css';
import Placeholder from '../Placeholder/Placeholder';
import { useNavigate } from 'react-router';
import ExamImg from '../../assets/Grades.svg';
import AssignmentImg from '../../assets/Student.svg';
import AnnouncementImg from '../../assets/Announcement.svg';
import './AddMaterial.css';
const AddMaterial = () => {
    const navigate = useNavigate();
    const AddAssignment = ()=>{
     navigate('/AddAssignment');
    }
    const AddExam = ()=>{
     navigate('/AddExam');
    }
    const AddAnnouncement = ()=>{
     navigate('/AddAnnouncement')
    }
    //for testing
    const role ="Instructor";
  return (
    <>
    {(role==="Instructor")?(<div className="add-material-component">
     <div className="card add-material-card" onClick ={AddAssignment}>
        <div className="add-material-header card-header green-bg light-text">
         <h4>Add Assignment</h4>
        </div>
        <div className="card-body add-material-body ">
        <img src={AssignmentImg} alt="Assignment" />
        </div>
      </div>
      <div className="card add-material-card" onClick={AddExam}>
        <div className="add-material-header card-header green-bg light-text">
         <h4>Add Exam</h4>
        </div>
        <div className="card-body add-material-body">
        <img src={ExamImg} alt="Exam" />
        </div>
      </div>
      <div className="card add-material-card" onClick={AddAnnouncement}>
        <div className="add-material-header card-header green-bg light-text">
         <h4>Add Announcement</h4>
        </div>
        <div className="card-body add-material-body">
        <img src={AnnouncementImg} alt="Announcement" />
        </div>
      </div>
    </div>):(
       <Placeholder
         text="Page Not Found"
         img={NotFoundImg}
         buttonText="Back To Home"
         buttonRoute="/"
       />
    )
    }
    </>
  )
}

export default AddMaterial
