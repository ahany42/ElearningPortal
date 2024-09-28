import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TextField,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";

let messagesList = [];
const AssignmentPage = ({ addAssignmentHandler, setAssignments }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [assignment, setAssignment] = useState({
    title: "",
    course: "",
    dueDate: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editableAssignment, setEditableAssignment] = useState(assignment);

  useEffect(() => {
    if (location.state?.assignment) {
      const assignedData = location.state.assignment;
      setAssignment(assignedData);
      setEditableAssignment(assignedData);
    }
  }, [location.state?.assignment]);

  const showToast = (msg) => {
    if (!messagesList.includes(msg)) {
      toast(msg, {
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          userSelect: "none",
          gap: "10px",
          padding: "20px",
        },
        onClose: () => {
          messagesList = messagesList.filter((m) => m !== msg);
        },
      });
      messagesList = [...messagesList, msg];
    }
  };

  const DeleteAssignment = (assignmentID) => {
    setAssignments((prevState) => {
      prevState.filter((assignment) => assignment.id !== assignmentID);
    });
    showToast("Assignment deleted successfully");
  };

  const EditAssignment = () => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((a) =>
        a.id === assignment.id ? { ...a, ...editableAssignment } : a
      )
    );
    setIsEditing(false);
    showToast("Assignment updated successfully");
  };

  return (
    <Container
      maxWidth="md"
      style={{ marginTop: "2rem", position: "relative" }}
    >
      <Card elevation={3} style={{ padding: "1.5rem" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {isEditing ? (
              <TextField
                fullWidth
                variant="outlined"
                value={editableAssignment.title}
                onChange={(e) =>
                  setEditableAssignment({
                    ...editableAssignment,
                    title: e.target.value,
                  })
                }
              />
            ) : (
              assignment.title || "No Assignment Available"
            )}
          </Typography>

          <div
            className="course-icons admin-icons"
            style={{ marginBottom: "1rem" }}
          >
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  style={{ marginRight: "10px", backgroundColor: "#ff7043" }}
                  onClick={EditAssignment}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#6e6e69" }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faEdit}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                  onClick={() => setIsEditing(true)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => DeleteAssignment(assignment.id)}
                />
              </>
            )}
          </div>

          <Table className="table table-bordered">
            <thead>
              <tr>
                <th>Field</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Course</td>
                <td>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={editableAssignment.course}
                      onChange={(e) =>
                        setEditableAssignment({
                          ...editableAssignment,
                          course: e.target.value,
                        })
                      }
                    />
                  ) : (
                    assignment.course || "Not available"
                  )}
                </td>
              </tr>
              <tr>
                <td>Due Date</td>
                <td>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="date"
                      variant="outlined"
                      value={editableAssignment.dueDate}
                      onChange={(e) =>
                        setEditableAssignment({
                          ...editableAssignment,
                          dueDate: e.target.value,
                        })
                      }
                    />
                  ) : (
                    assignment.dueDate || "Not available"
                  )}
                </td>
              </tr>
              <tr>
                <td>Description</td>
                <td>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={editableAssignment.description}
                      onChange={(e) =>
                        setEditableAssignment({
                          ...editableAssignment,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    assignment.description || "No description"
                  )}
                </td>
              </tr>
            </tbody>
          </Table>

          {!isEditing && (
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <Button
                variant="contained"
                onClick={() => navigate(-1)}
                style={{ marginRight: "1rem", backgroundColor: "#ff7043" }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  addAssignmentHandler();
                  navigate("/deadline");
                }}
                style={{ backgroundColor: "#6e6e69" }}
              >
                Add Assignment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default AssignmentPage;
