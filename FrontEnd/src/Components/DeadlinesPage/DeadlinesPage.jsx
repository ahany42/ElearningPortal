
import React, { useState } from "react";

import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import './Deadlinespage.css';


const DeadlinesPage = () => {

  const [activeTab, setActiveTab] = useState("assignments");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="deadlines-container">
      {/* Buttons for Assignments and Exams */}
      <div className="button-group">
        <button
          className={`tab-button ${
            activeTab === "assignments" ? "active" : ""
          }`}
          onClick={() => handleTabClick("assignments")}
        >
          Assignments
        </button>
        <button
          className={`tab-button ${activeTab === "exams" ? "active" : ""}`}
          onClick={() => handleTabClick("exams")}
        >
          Exams
        </button>
      </div>

      {/* Table to display either assignments or exams */}
      <Table striped bordered hover className="deadlines-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Course</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {activeTab === "assignments" ? (
            <>
             
              <tr>
                <td>1</td>
                <td>Assignment 1</td>
                <td>React Basics</td>
                <td>2024-09-30</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Assignment 2</td>
                <td>Node.js</td>
                <td>2024-10-05</td>
              </tr>
            </>
          ) : (
            <>
            
              <tr>
                <td>1</td>
                <td>Midterm Exam</td>
                <td>React Advanced</td>
                <td>2024-10-20</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Final Exam</td>
                <td>Node.js</td>
                <td>2024-11-15</td>
              </tr>
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default DeadlinesPage
