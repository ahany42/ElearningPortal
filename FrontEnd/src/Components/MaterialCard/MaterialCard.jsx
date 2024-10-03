import { useContext } from 'react';
import { CurrentUserContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen , faFileAlt ,faBullhorn} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Components/CourseMaterial/CourseMaterial.css';

const MaterialCard = ({material}) => {
    const { showMessage } = useContext(CurrentUserContext);

    {/* for testing */}
    const seeMore=true;
    const handleSeeMore = () => {
        showMessage("See More Coming Soon", null);
    }
  return (
    <>
    {
        material.materialType === "exam" ?
            <div className=" card material-card ">
                <div className=" material-sub-card">
                    <FontAwesomeIcon className="material-icon" size="3x" icon={faFileAlt} color="#274546"/>
                    <div>
                        <div className="material-title-due">
                        <h6>
                           {material.instructorName} posted a new exam :{material.title}
                        </h6>
                        </div>
                        <h6 className="material-date">
                            {material.startDate} - {material.endDate}
                        </h6>
                    </div>
                    {
                        !material.solve ?
                            <button className="material-button blue-text bold-text">Solve</button>
                        :
                            <button className="material-button blue-text bold-text">See Grade</button>
                    }
                </div>
            </div>
    :   material.materialType=== "assignment" ?
        <div className=" card material-card ">
            <div className=" material-sub-card">
                <FontAwesomeIcon className="material-icon" size="3x" icon={faBookOpen} color="#274546"/>
                <div>
                    <div className="material-title-due">
                        <h6>
                        {material.instructorName} posted a new assignment :{material.title}
                        </h6>
                    </div>
                    <h6 className="material-date">
                    {material.startDate} - {material.endDate}
                    </h6>
                </div>
                {
                   material.submitted?
                        <h6 className="material-button blue-text bold-text">Submitted</h6>
                    :
                        <button className="material-button blue-text bold-text">Submit</button>
                }
            </div>
        </div>
    :   material.materialType === "announcement" ?
            <div className="material-card card">
                <div className=" card material-card ">
                    <div className=" material-sub-card">
                        <FontAwesomeIcon className="material-icon" size="3x" icon={faBullhorn} color="#274546"/>
                        <div>
                            <div className="material-title-due">
                                <h6>
                                {material.instructorName} posted a new announcement :{material.announcement}
                                </h6>
                            </div>
                            <h6 className="material-date">
                            {material.startDate}
                            </h6>
                        </div>
                        {
                            seeMore?
                                <h6 className="material-button blue-text bold-text" onClick={handleSeeMore}>
                                    See More
                                </h6>
                            :
                                null
                        }
                    </div>
                </div>
            </div>
        :
            null
    }
    </>
  )
}

export default MaterialCard
