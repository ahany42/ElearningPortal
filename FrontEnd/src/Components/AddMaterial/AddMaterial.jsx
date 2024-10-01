import 'bootstrap/dist/css/bootstrap.min.css';
import Placeholder from '../Placeholder/Placeholder';
import { useNavigate } from 'react-router';
import AddAssignmentForm from '../AddAssignmentForm/AddAssignmentForm';
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
        <div className="add-material-header card-header">
         <h4>Add Assignment</h4>
        </div>
      </div>
      <div className="card add-material-card" onClick={AddExam}>
        <div className="add-material-header card-header">
         <h4>Add Exam</h4>
        </div>
      </div>
      <div className="card add-material-card" onClick={AddAnnouncement}>
        <div className="add-material-header card-header">
         <h4>Add Announcement</h4>
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
