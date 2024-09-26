import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen , faFileAlt ,faBullhorn} from '@fortawesome/free-solid-svg-icons';
import './CourseMaterial.css';
const CourseMaterial = ({materialType}) => {
    //for testing
    const submitted = false;
    //for testing
    const solved = true;
    //for testing
    const seeMore = true;
  return (
  <>
    {/* for testing */}
    { materialType === "exam"?(
    <div className=" card material-card ">
    <div className=" material-sub-card">
    <FontAwesomeIcon className="material-icon" size="3x" icon={faFileAlt} color="#274546"/>
    <div>
    <div className="material-title-due">
    <h6>Aly Hany posted a new exam :Exam 1</h6>
    </div>
    <h6 className="material-date">26th Sep 24 - 27th Sep 24 </h6>
    </div>
   
    {!solved? <button className="material-button blue-text bold-text">Solve</button>:(<button className="material-button blue-text bold-text">See Grade</button>)}
    </div>
    </div>
    ):materialType=== "assignment"?(
        <div className=" card material-card ">
        <div className=" material-sub-card">
        <FontAwesomeIcon className="material-icon" size="3x" icon={faBookOpen} color="#274546"/>
        <div>
        <div className="material-title-due">
        <h6>Aly Hany posted a new assignment :Assignment 1</h6>
        </div>
        <h6 className="material-date">26th Sep 24 - 27th Sep 24 </h6>
        </div>
       
        {submitted? <h6 className="material-button blue-text bold-text">Submitted</h6>:(<button className="material-button blue-text bold-text">Submit</button>)}
        </div>
        </div>
    ):materialType === "announcement"?(
        <div className="material-card">
 <div className=" card material-card ">
        <div className=" material-sub-card">
        <FontAwesomeIcon className="material-icon" size="3x" icon={faBullhorn} color="#274546"/>
        <div>
        <div className="material-title-due">
        <h6>Aly Hany posted a new announcement :Due Dates has been postponed to next week b..</h6>
        </div>
        <h6 className="material-date">26th Sep 24</h6>
        </div>
       
        {seeMore? <h6 className="material-button blue-text bold-text">See More</h6>:null}
        </div>
        </div>
        </div>
    ):null}
    </>
   
  )
}

export default CourseMaterial
