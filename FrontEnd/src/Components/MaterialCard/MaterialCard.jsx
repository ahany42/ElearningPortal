import { useContext, useState } from "react";
import { CurrentUserContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faFileAlt,
  faBullhorn,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../Components/CourseMaterial/CourseMaterial.css";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getCookie } from "../Cookie/Cookie.jsx";
import "./MaterialCard.css";
import { jwtDecode } from "jwt-decode";

const MaterialCard = ({ material }) => {
  const [editableExam, setEditableExam] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  console.log(jwtDecode(getCookie("token")));
  console.log(material);
  const {
    showMessage,
    INITIAL_MATERIALS,
    setExams,
    confirmationToast,
    currentUser,
  } = useContext(CurrentUserContext);
  /* for testing */
  const seeMore = true;
  const handleSeeMore = () => {
    showMessage("See More Coming Soon", null);
  };
  const deleteExamHandler = async (examID) => {
    const isConfirmed = await confirmationToast(
      "Are You Sure You Want to remove student?"
    );
    if (isConfirmed) {
      const response = await fetch(
        `http://localhost:3008/deleteExam/${examID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: getCookie("token"),
          },
          body: {
            examId: examID,
          },
        }
      );
      if (response.status === 201) {
        setExams((prevState) => prevState.filter((exam) => exam.id !== examID));
        showMessage(response.message, false);
      } else {
        showMessage(response.error, true);
      }
    }
  };
  // const editExamHandler = async (material) => {
  //   setEditableExam({
  //     id: material.id,
  //     title: material.title,
  //     startDate: material.startDate,
  //     dueDate: material.dueDate,
  //     duration: material.duration,
  //   });
  //   setIsEditing(true);
  // };

  //   try {
  //     const date1 = new Date(Date.parse("2024-09-01T00:00:00.000+00:00"));
  //     const date2 = new Date();
  //     const milliseconds1 = date1.getTime();
  //     const milliseconds2 = date2.getTime();
  //     const totalMelliseconds = milliseconds2 + milliseconds1;
  //     const differenceDate = new Date(totalMelliseconds);
  //     const date3 = new Date(Date.parse("2024-09-30T00:00:00.000+00:00"));
  //     const date4 = new Date();
  //     const milliseconds3 = date3.getTime();
  //     const milliseconds4 = date4.getTime();
  //     const totalMelliseconds2 = milliseconds3 + milliseconds4;
  //     const differenceDate2 = new Date(totalMelliseconds2);
  //     console.log(differenceDate, differenceDate2);
  //     const response = await fetch(
  //       `http://localhost:3008/updateExam/${examId}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `${getCookie("token")}`, // Ensure token is correctly fetched
  //         },
  //         body: JSON.stringify({
  //           title: "Midterm Exam" + "test",
  //           sDate: differenceDate,
  //           duration: 90 + 10,
  //           eDate: differenceDate2,
  //         }),
  //       }
  //     );

  //     const result = await response.json();

  //     if (response.ok) {
  //       setExams((prevExams) =>
  //       prevExams.map((e) =>
  //        e.id === editableExam.id
  //        ? {
  //       ...e,
  //       title: editableExam.title,
  //       courseID: courses.find((c) => c.title === editableExam.course)
  //       ?.id,
  //       dueDate: editableExam.dueDate,
  //       description: editableExam.description,
  //       }
  //       : e
  //       )
  //       );
  //       setIsEditing(false);
  //       showMessage("Exam updated successfully", false);
  //     } else {
  //       showMessage(result.error, true);
  //     }
  //   } catch (error) {
  //     console.error("Error updating exam:", error);
  //     showMessage("Unexpected Error Occurred", true);
  //   }
  // };
  const deleteAnnouncementHandler = async (ids) => {
    let id = "32e33491-9827-4363-b4e4-a20362c83560";
    let userId = jwtDecode(getCookie("token")).id;
    console.log(jwtDecode(getCookie("token")).id);
    const isConfirmed = await confirmationToast(
      "Are You Sure You Want to Delete This Announcement?"
    );
    if (isConfirmed) {
      showMessage("Deleting announcement...", false);
      try {
        const response = await fetch(
          `http://localhost:3008/deletePost/${userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: getCookie("token"), // Assuming you use JWT authentication
            },
            body: JSON.stringify({
              id: id,
            }),
          }
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          showMessage("Announcement deleted successfully!", true);
          // Update your UI to reflect the deleted announcement
        } else {
          const data = await response.json();
          showMessage(
            data.error || "An error occurred. Please try again later.",
            false
          );
        }
      } catch (err) {
        showMessage("An error occurred. Please try again later.", false);
        console.error(err);
      }
    }
  };
  const editAnnouncementHandler = () => {
    showMessage(" edit announcement coming soon", false);
  };
  const deleteAssignmentHandler = async () => {
    const isConfirmed = await confirmationToast(
      "Are You Sure You Want to remove student?"
    );
    if (isConfirmed) {
      showMessage("delete assignment coming soon", false);
    }
  };
  const editAssignmentHandler = () => {
    showMessage(" edit assignment coming soon", false);
  };
  return (
    <>
      {isEditing && <Modal />}
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
          {currentUser.role === "Instructor" && (
            <div className="course-icons-materialCard admin-icons">
              <FontAwesomeIcon
                icon={faEdit}
                id={material.id} // Set the ID for reference (optional)
                style={{ cursor: "pointer" }}
                className="edit-icon"
                onClick={() => editExamHandler(material)}
              />
              <FontAwesomeIcon
                icon={faTrash}
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => deleteExamHandler(INITIAL_MATERIALS.id)}
              />
            </div>
          )}
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
          {currentUser.role === "Instructor" && (
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
            </div>
          )}
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
              {currentUser.role === "Instructor" && (
                <div className="course-icons-materialCard admin-icons">
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{ cursor: "pointer" }}
                    className="edit-icon"
                    onClick={() =>
                      editAnnouncementHandler(INITIAL_MATERIALS.id)
                    }
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => deleteAnnouncementHandler(material.id)}
                  />
                </div>
              )}
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
};

export default MaterialCard;
