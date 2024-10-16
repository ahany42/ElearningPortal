import { useState, useEffect, useContext } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TextField,
} from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { CurrentUserContext } from "../../App";
import "./ExamPage.css";

const ExamPage = ({ exams }) => {
  console.log(exams);
  const navigate = useNavigate();
  const location = useLocation();
  const { showMessage, currentUser, setExams, courses } =
    useContext(CurrentUserContext);

  const [exam, setExam] = useState({
    title: "",
    courseID: "",
    dueDate: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editableExam, setEditableExam] = useState(exam);

  useEffect(() => {
    if (location.state?.eid) {
      const examData = exams.find((el) => el.id === location.state.eid);
      if (examData) {
        const courseTitle =
          courses?.find((c) => c.id === examData.courseID)?.title ||
          "Not available";
        setExam(examData);
        setEditableExam({
          id: examData.id,
          title: examData.title,
          course: courseTitle,
          dueDate: examData.dueDate,
          description: examData.description,
        });
      }
    } else {
      showMessage("Exam not found", true);
      navigate("/deadline");
    }
  }, [exams, location.state]);
  //page only for student
  const deleteExamHandler = async (examId) => {
    try {
      const response = await fetch(
        `http://localhost:3008/deleteExam/${examId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: getCookie("token"),
          },
        }
      );

      if (response.ok) {
        setExams((prevState) => prevState.filter((exam) => exam.id !== examId));
        showMessage("Exam deleted successfully", false);
        navigate("/deadline");
      } else {
        const data = await response.json();
        showMessage(data.error, true);
      }
    } catch (error) {
      showMessage("Unexpected Error Occurred", true);
    }
  };
  const editExamHandler = async () => {
    if (!editableExam.title || !editableExam.dueDate) {
      showMessage("Title and date are required.", true);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3008/updateExam/${exam.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${yourToken}`,
          },
          body: JSON.stringify({
            title: editableExam.title,
            sDate: editableExam.startDate,
            duration: editableExam.duration,
            eDate: editableExam.endDate,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
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
      } else {
        showMessage(result.error, true);
      }
    } catch (error) {
      showMessage("Unexpected Error Occurred", true);
    }
  };

  const solveExamHandler = () => {
    navigate(`/examQuestions/${exam.id}`);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Card elevation={3} style={{ padding: "1.5rem", position: "relative" }}>
        <CardContent>
          {/* Exam Title */}
          <Typography variant="h4" sx={{ marginBottom: "15px" }}>
            {isEditing ? (
              <TextField
                fullWidth
                variant="outlined"
                value={editableExam.title}
                onChange={(e) =>
                  setEditableExam({ ...editableExam, title: e.target.value })
                }
              />
            ) : (
              exam.title || "No Exam Available"
            )}
          </Typography>

          {/* Admin Edit/Delete Icons */}
          {currentUser.role &&
            (currentUser.role === "Admin" ||
              currentUser.role === "SuperAdmin" ||
              currentUser.role === "Instructor") && (
              <div
                className="admin-icons"
                style={{ position: "absolute", top: "10px", right: "20px" }}
              >
                {!isEditing && (
                  <>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="edit-icon"
                      onClick={() => setIsEditing(true)}
                      style={{ cursor: "pointer", marginRight: "10px" }}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="delete-icon"
                      onClick={() => deleteExamHandler(exam.id)}
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  </>
                )}
              </div>
            )}
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
                    <Select
                      fullWidth
                      value={editableExam.course}
                      onChange={(e) =>
                        setEditableExam({
                          ...editableExam,
                          course: e.target.value,
                        })
                      }
                    >
                      {courses.map((course) => (
                        <MenuItem key={course.id} value={course.title}>
                          {course.title}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    courses.find((c) => c.id === exam.courseID)?.title ||
                    "Not available"
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
                      value={editableExam.dueDate}
                      onChange={(e) =>
                        setEditableExam({
                          ...editableExam,
                          dueDate: e.target.value,
                        })
                      }
                    />
                  ) : (
                    exam.dueDate || "Not available"
                  )}
                </td>
              </tr>
              <tr>
                <td>Description</td>
                <td>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={editableExam.description}
                      onChange={(e) =>
                        setEditableExam({
                          ...editableExam,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    exam.description || "No description available"
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            {isEditing ? (
              <div className="d-flex justify-content-center gap-5">
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#f44336" }}
                  onClick={() => {
                    setIsEditing(false);
                    setEditableExam({
                      id: exam.id,
                      title: exam.title,
                      course: courses.find((c) => c.id === exam.courseID)
                        ?.title,
                      dueDate: exam.dueDate,
                      description: exam.description,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#4caf50" }}
                  onClick={editExamHandler}
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="d-flex justify-content-center gap-5">
                <Button
                  variant="contained"
                  onClick={() => navigate(-1)}
                  className="pascalCase-text dark-bg light-text backButton-ExamPage"
                >
                  Back
                </Button>
                {currentUser.role === "Student" && (
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#2196f3" }}
                    onClick={solveExamHandler}
                    className="pascalCase-text green-bg"
                  >
                    Solve
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};


export default ExamPage;
