import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import './CourseMaterial.css';
const CourseMaterial = ({materialType}) => {
    const submitted = false;
  return (
  <>
    {/* for testing */}
    { materialType === "exam"?(
    <div className=" card material-card ">
    <div className=" material-sub-card">
    <FontAwesomeIcon className="material-icon" size="3x" icon={faBookOpen} color="#274546"/>
    <div>
    <div className="material-title-due">
    <h6>Aly Hany posted a new assignment :Assignment 1</h6>
    </div>
    <h6 className="material-date">26th Sep 24 - 27th Sep 24 </h6>
    </div>
   
    {submitted? <h6 className="submit-material blue-text bold-text">Submitted</h6>:(<button className="submit-material blue-text bold-text">Submit</button>)}
    </div>
    </div>
    ):materialType=== "assignment"?(
        <div className="material-card">

        </div>
    ):materialType === "announcement"?(
        <div className="material-card">

        </div>
    ):null}
    </>
   
  )
}

export default CourseMaterial
