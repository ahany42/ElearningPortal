import { useState, useContext, useEffect, useRef } from "react";
import Table from "react-bootstrap/Table";
import { CurrentUserContext } from "../../App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Deadlinespage.css";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddAssignmentForm from "../AddAssignmentForm/AddAssignmentForm.jsx";

const DeadlinesPage = ({ assignments, exams }) => {
  const [activeTab, setActiveTab] = useState("assignments");
  const [showForm, setShowForm] = useState(false);
  const CardsContainer = useRef(null);
  const { currentUser, setAssignments, showMessage, courses } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const showFormHandler = () => {
    if (activeTab === "exams") {
      showMessage("Exams are not available yet", null);
      return;
    }
    setShowForm(!showForm);
  };

  useEffect(() => {
    if (showForm) {
      CardsContainer.current.style.opacity = "0.3";
      CardsContainer.current.style.pointerEvents = "none";
      CardsContainer.current.style.userSelect = "none";
    } else {
      CardsContainer.current.style.opacity = "1";
      CardsContainer.current.style.pointerEvents = "";
      CardsContainer.current.style.userSelect = "";
    }
  }, [showForm]);

  const addAssignmentHandler = (newAssignment) => {
    setAssignments((prevState) => [...prevState, newAssignment]);
  };

  return (
    <>
      {showForm &&
        (activeTab === "assignments" ? (
          <AddAssignmentForm
            addHandler={addAssignmentHandler}
            showFormHandler={showFormHandler}
          />
        ) : (
          <></> // You can add an Exam Form here
        ))}
      <div className="deadlines-container pb-5" ref={CardsContainer}>
        <div className="button-group position-relative mt-5 mb-5">
          <div className="btn-container">
            <label className="switch btn-color-mode-switch">
              <input
                value="1"
                id="color_mode"
                name="color_mode"
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    handleTabClick("exams");
                  } else {
                    handleTabClick("assignments");
                  }
                }}
              />
              <label
                className="btn-color-mode-switch-inner"
                data-off="Assignments"
                data-on="Exams"
                htmlFor="color_mode"
              ></label>
            </label>
          </div>
          {currentUser.role &&
            (currentUser.role === "Admin" ||
              currentUser.role === "SuperAdmin") && (
              <button
                className="AddButton add-deadline"
                onClick={showFormHandler}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  title={
                    activeTab === "assignments" ? "Add Assignment" : "Add Exam"
                  }
                />
                {activeTab === "assignments" ? "Add Assignment" : "Add Exam"}
              </button>
            )}
        </div>
        <Table striped bordered hover className="deadlines-table">
          <thead>
            <tr>
              <th style={{ width: "70px" }}>No</th>
              <th>Title</th>
              <th>Course</th>
              <th>Date</th>
              <th>View Details</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === "assignments" ? (
              assignments && assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <tr key={uuidv4()}>
                    <td>
                      <span className="center-value">{index + 1}</span>
                    </td>
                    <td>
                      <span>{assignment.title}</span>
                    </td>
                    <td>
                      <span>
                        {
                          courses.find((c) => c.id === assignment.courseID)
                            ?.title
                        }
                      </span>
                    </td>
                    <td>
                      <span>{assignment.dueDate}</span>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate("/AssignmentPage", {
                            state: { aid: assignment.id },
                          })
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No Assignments Available
                  </td>
                </tr>
              )
            ) : exams && exams.length > 0 ? (
              exams.map((exam, index) => (
                <tr key={uuidv4()}>
                  <td>
                    <span className="center-value">{index + 1}</span>
                  </td>
                  <td>
                    <span>{exam.name}</span>
                  </td>
                  <td>
                    <span>
                      {courses.find((c) => c.id === exam.courseID)?.title}
                    </span>
                  </td>
                  <td>
                    <span>{exam.date}</span>
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate("/ExamPage", { state: { eid: exam.id } })
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No Exams Available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default DeadlinesPage;
