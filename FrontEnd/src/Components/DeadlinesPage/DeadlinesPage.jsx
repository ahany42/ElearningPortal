import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Deadlinespage.css";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";

const DeadlinesPage = ({ assignments }) => {
  const [activeTab, setActiveTab] = useState("assignments");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const navigate = useNavigate();

  return (
    <div className="deadlines-container">
      <div className="button-group">
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
      </div>
      <Table striped bordered hover className="deadlines-table">
        <thead>
          <tr>
            <th>No</th>
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
                  <td>{index + 1}</td>
                  <td>{assignment.title}</td>
                  <td>{assignment.course}</td>
                  <td>{assignment.dueDate}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate("/AssignmentPage", {
                          state: { assignment },
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
          ) : (
            <>
              <tr>
                <td>1</td>
                <td>Midterm Exam</td>
                <td>React Advanced</td>
                <td>2024-10-20</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => navigate("/ExamPage")}
                  >
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Final Exam</td>
                <td>Node.js</td>
                <td>2024-11-15</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => navigate("/ExamPage")}
                  >
                    View
                  </button>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default DeadlinesPage;
