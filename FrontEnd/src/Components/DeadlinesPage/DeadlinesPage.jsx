import { useState, useContext, useEffect, useRef } from "react";
import Table from "react-bootstrap/Table";
import { CurrentUserContext } from "../../App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Deadlinespage.css";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import NoAssignmentImg from '../../assets/Student.svg';
import NoExamImg from '../../assets/Student.svg';
import Placeholder from "../Placeholder/Placeholder";
import AddAssignment from "../AddAssignment/AddAssignment";
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
      window.scrollBy(0, 228)
      CardsContainer.current.style.height = "950px";
      CardsContainer.current.style.opacity = "0.3";
      CardsContainer.current.style.pointerEvents = "none";
      CardsContainer.current.style.userSelect = "none";
    } else {
      document.body.scrollIntoView({ behavior: "smooth" });
      CardsContainer.current.style.height = "";
      CardsContainer.current.style.opacity = "1";
      CardsContainer.current.style.pointerEvents = "";
      CardsContainer.current.style.userSelect = "";
    }
  }, [showForm]);

  const addAssignmentHandler = (newAssignment) => {
    setAssignments((prevState) => {
      return [...prevState, newAssignment];
    });
  }

  return (
    <>
      {showForm &&
        (activeTab === "assignments" ? (
          <AddAssignment
            addHandler={addAssignmentHandler}
            showFormHandler={showFormHandler}
          />
        ) : (
          <></> // Add Exam Form
        ))}
      <div className="deadlines-container pb-5" ref={CardsContainer}>
        <div className="button-group position-relative mt-5 mb-5">
          <input
            id="switch"
            onChange={(e) => {
              if (e.target.checked) {
                handleTabClick("exams");
              } else {
                handleTabClick("assignments");
              }
            }}
            type="checkbox"
          />
          <div className="switch-app">
            <label htmlFor="switch" className="switch-label">
              <span className="switch-light">Assignments</span>
              <span className="switch-dark">Exams</span>
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
                      <span>{assignment.title || "Not Available"}</span>
                    </td>
                    <td>
                      <span>
                        {courses.find((c) => c.id === assignment.courseID)
                          ?.title || "Not available"}
                      </span>
                    </td>
                    <td>
                      <span>{assignment.dueDate || "Not Available"}</span>
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
                    <Placeholder
                        style={{margin: "1em auto"}}
                        img={NoAssignmentImg}
                        text="No Assignment available. Add one now!"
                    />
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
                    <span>{exam.title || "Not Available"}</span>
                  </td>
                  <td>
                    <span>
                      {courses.find((c) => c.id === exam.courseID)?.title ||
                        "Not Available"}
                    </span>
                  </td>
                  <td>
                    <span>{exam.dueDate || "Not Available"}</span>
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate("/ExamPage", {
                          state: { eid: exam.id },
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
                  <Placeholder
                    img={NoExamImg}
                    text="No Exam available. Add one now!"
                  />
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
