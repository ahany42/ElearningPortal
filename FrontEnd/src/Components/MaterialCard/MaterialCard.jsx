import { useContext } from 'react';
import { CurrentUserContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen , faFileAlt ,faBullhorn} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Components/CourseMaterial/CourseMaterial.css';
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import {getCookie} from "../Cookie/Cookie.jsx";
import './MaterialCard.css'

const MaterialCard = ({material}) => {
  const { showMessage, INITIAL_MATERIALS , setExams , editableExam , setIsEditing,confirmationToast,currentUser} = useContext(CurrentUserContext);
    /* for testing */
  const seeMore = true;
  const handleSeeMore = () => {
    showMessage("See More Coming Soon", null);
  };
  const deleteExamHandler = async(examID) => {
    const isConfirmed = await confirmationToast("Are You Sure You Want to remove student?");
    if(isConfirmed){
      const response = await fetch(`http://localhost:3008/deleteExam/${examID}`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization:getCookie("token")
        },
        body: {
          examId:examID
        }
    });
    if(response.status===201){
      setExams((prevState) => prevState.filter((exam) => exam.id !== examID));
      showMessage(response.message, false);
    }
    else{
      showMessage(response.error,true)
    }
    }
};
const editExamHandler = () => {
    if (!editableExam.title || !editableExam.dueDate) {
        showMessage("Title and date are required.", true);
        return;
    }
    setExams((prevExams) =>
        prevExams.map((e) =>
            e.id === exam.id
    ? {
        ...e,
        title: editableExam.title,
        courseID: courses.find((c) => c.title === editableExam.course)
                ?.id,
                dueDate: editableExam.dueDate,
                description: editableExam.description,
            }
            : e
        )
    );
    setIsEditing(false);
    showMessage("Exam updated successfully", false);
};
const deleteAnnouncementHandler = async() => {
  const isConfirmed = await confirmationToast("Are You Sure You Want to remove student?");
  if(isConfirmed){
    showMessage("delete announcement coming soon",false);
  }

}
const editAnnouncementHandler = () => {
  showMessage(" edit announcement coming soon",false);

}
const deleteAssignmentHandler = async() => {
  const isConfirmed = await confirmationToast("Are You Sure You Want to remove student?");
  if(isConfirmed){
    showMessage("delete assignment coming soon",false);
  }
}
const editAssignmentHandler = () => {
  showMessage(" edit assignment coming soon",false);
}
return (
  <>
    {material.materialType === "exam" ? (
      <div className=" card material-card ">
        <div className=" material-sub-card">
          <FontAwesomeIcon
            className="material-icon"
            size="3x"
            icon={faFileAlt}
            color="#274546"
          />
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
        </div>
        { currentUser.role==="Instructor"  &&
        <div className="course-icons-materialCard admin-icons">
          <FontAwesomeIcon
            icon={faEdit}
            style={{ cursor: "pointer" }}
            className="edit-icon"
            onClick={() => editExamHandler(INITIAL_MATERIALS.id)}
          />
          <FontAwesomeIcon
            icon={faTrash}
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => deleteExamHandler(INITIAL_MATERIALS.id)}
          />
        </div>}
      </div>
    ) : material.materialType === "assignment" ? (
      <div className=" card material-card ">
        <div className=" material-sub-card">
          <FontAwesomeIcon
            className="material-icon"
            size="3x"
            icon={faBookOpen}
            color="#274546"
          />
          <div>
            <div className="material-title-due">
              <h6>
                {material.instructorName} posted a new assignment :
                {material.title}
              </h6>
            </div>
            <h6 className="material-date">
              {material.startDate} - {material.endDate}
            </h6>
          </div>
        </div>{" "}
        { CurrentUserContext.role==="Instructor" &&
        <div className="course-icons-materialCard admin-icons">
          <FontAwesomeIcon
            icon={faEdit}
            style={{ cursor: "pointer" }}
            className="edit-icon"
            onClick={() => editAssignmentHandler(INITIAL_MATERIALS.id)}
          />
          <FontAwesomeIcon
            icon={faTrash}
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => deleteAssignmentHandler(INITIAL_MATERIALS.id)}
          />
        </div>}
      </div>
    ) : material.materialType === "announcement" ? (
      <div className="material-card card">
        <div className=" card material-card ">
          <div className=" material-sub-card">
            <FontAwesomeIcon
              className="material-icon"
              size="3x"
              icon={faBullhorn}
              color="#274546"
            />
            <div>
              <div className="material-title-due">
                <h6>
                  {material.instructorName} posted a new announcement :
                  {material.announcement}
                </h6>
              </div>
              <h6 className="material-date">{material.startDate}</h6>
            </div>
            { CurrentUserContext.role==="Instructor" &&
            <div className="course-icons-materialCard admin-icons">
              <FontAwesomeIcon
                icon={faEdit}
                style={{ cursor: "pointer" }}
                className="edit-icon"
                onClick={() => editAnnouncementHandler(INITIAL_MATERIALS.id)}
              />
              <FontAwesomeIcon
                icon={faTrash}
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => deleteAnnouncementHandler(INITIAL_MATERIALS.id)}
              />
            </div>}
            {seeMore ? (
              <h6
                className="material-button blue-text bold-text"
                onClick={handleSeeMore}
              >
                See More
              </h6>
            ) : null}
          </div>
        </div>
      </div>
    ) : null}
  </>
);
}

export default MaterialCard
