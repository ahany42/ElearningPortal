import { useState, useEffect, useContext } from "react";
import {Container,Card,CardContent,Typography,Button,Table,TextField} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { Select, MenuItem } from "@mui/material";
import { CurrentUserContext } from "../../App";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import "./AssignmentPage.css";
import { set } from "date-fns";
import {getCookie} from "../Cookie/Cookie.jsx";
import {Back_Origin} from '../../../Front_ENV.jsx';

const AssignmentPage = ({ assignments }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showMessage, currentUser, setAssignments, courses } = useContext(CurrentUserContext);
  const [file, setFile] = useState(null);
  const [assignment, setAssignment] = useState({
    title: "",
    courseID: "",
    startDate: "",
    endDate:"",
    description: "",
    document:""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editableAssignment, setEditableAssignment] = useState(assignment);

  useEffect(() => {
    if (location.state && location.state.aid) {
      const assignedData = assignments.find((el) => el.id === location.state.aid);
      if (assignedData) {
        setAssignment(assignedData);
        setEditableAssignment({
          id: assignedData.id,
          title: assignedData.title,
          course: courses.find((c) => c.id === assignedData.courseID)?.title,
          endDate: assignedData.endDate,
          startDate: assignedData.startDate,
          description: assignedData.description,
          document: assignedData.document,
        });
      }
    } else {
        showMessage("No assignment found", true);
        navigate("/deadline");
    }
  }, [location.state, assignments]);

  if (!assignment) {
    return (
      <Container
        maxWidth="md"
        style={{ marginTop: "2rem", position: "relative" }}
      >
        <Card elevation={3} style={{ padding: "1.5rem", position: 'relative' }}>
          <CardContent>
            <Typography variant="h4" className="text-center">
              No Assignment Available
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const DeleteAssignment = (assignmentID) => {
    setAssignments((prevState) => {
      return prevState.filter((assignment) => assignment.id !== assignmentID);
    });
    showMessage("Assignment deleted successfully", false);
    navigate("/deadline");
  };

  const EditAssignment = () => {
    // Update the original assignment state with editableAssignment
    setAssignment({
        id: assignment.id,
        title: editableAssignment.title,
        courseID: courses.find((c) => c.title === editableAssignment.course)?.id,
        endDate: editableAssignment.endDate,
        startDate: editableAssignment.startDate,
        description: editableAssignment.description
    });
    setAssignments((prevAssignments) =>
      prevAssignments.map((a) =>
        a.id === assignment.id ? { ...a,
            title: editableAssignment.title,
            courseID: courses.find((c) => c.title === editableAssignment.course)?.id,
            endDate: editableAssignment.endDate,
            startDate: editableAssignment.startDate,
            description: editableAssignment.description
        } : a
      )
    );
    setIsEditing(false);
    showMessage("Assignment updated successfully", false);
  };
 const SubmitAssignment= ()=>{
     navigate("/AssignmentPage", {state: {...location.state, submitMode: "submit"}})
 }
 const ViewAssignment = ()=>{
  navigate(`ViewPdf/${assignment.document}/${assignment.title}`)
 }
 const handleFileChangePdf = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile && selectedFile.type === 'application/pdf') {
    setFile(selectedFile);
  } else {
    showMessage('Please upload a valid PDF file.',true);
  }
};
 const handleSubmitPdf = async (event) => {
  event.preventDefault();
  if (!file) {
    showMessage("Please Attach PDF File",true);
    return;
  }
  const formData = new FormData();
  formData.append('assignmentID', assignment.id);
  formData.append('pdf',file);
  try {
    const response = await fetch(`${Back_Origin}/solveAssignment`, {
      method: 'POST',
      body: formData,
      headers: {
      'authorization': getCookie('token')
      },
    });
    const data = await response.json();
    if(data.error){
      showMessage(data.error,true);
      setFile("")
      document.getElementById("pdfInput").value = ""
    }
    else{
      showMessage(data.message,false);
      navigate('/deadline')
    }
  } catch (error) {
    showMessage('Error uploading file', true);
  }
};
  return (
    <>
    {!location.state.submitMode ?<Container
      maxWidth="md"
      style={{ marginTop: "2rem", position: "relative" }}
    >
      <Card elevation={3} style={{ padding: "1.5rem", position: 'relative' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom
                      style={!isEditing? {marginBottom: "15px"} : {}}>
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

          {/* Assignment Information */}
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
                        value={editableAssignment.course}
                        onChange={(e) =>
                            setEditableAssignment({
                              ...editableAssignment,
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
                    courses.find((c) => c.id === assignment.courseID)?.title || "Not available"
                )}
              </td>
            </tr>
            <tr>
              <td>Start Date</td>
              <td>
                {isEditing ? (
                    <TextField
                        fullWidth
                        type="date"
                        variant="outlined"
                        value={editableAssignment.startDate}
                        onChange={(e) =>
                            setEditableAssignment({
                              ...editableAssignment,
                              startDate: e.target.value,
                            })
                        }
                    />
                ) : (
                    assignment.startDate || "Not available"
                )}
              </td>
            </tr>
            <tr>
              <td>End Date</td>
              <td>
                {isEditing ? (
                    <TextField
                        fullWidth
                        type="date"
                        variant="outlined"
                        value={editableAssignment.endDate}
                        onChange={(e) =>
                            setEditableAssignment({
                              ...editableAssignment,
                              endDate: e.target.value,
                            })
                        }
                    />
                ) : (
                    assignment.endDate || "Not available"
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

          {/* Assignment Actions */}
          <div style={{marginTop: "2rem", textAlign: "center"}}>
            {
              isEditing ? (
                  <div className="d-flex justify-content-center gap-5">
                    <Button
                        variant="contained"
                        style={{backgroundColor: "#f44336"}}
                        onClick={() => {
                          setIsEditing(false);
                          setEditableAssignment({
                            id: assignment.id,
                            title: assignment.title,
                            course: courses.find((c) => c.id === assignment.courseID)?.title,
                            endDate: assignment.endDate,
                            startDate: assignment.startDate,
                            description: assignment.description,
                          });
                        }}
                    >
                      Cancel
                    </Button>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#4caf50" }}
                        onClick={EditAssignment}
                    >
                      Save
                    </Button>
                  </div>
              ) : (
                <>
                <div className="d-flex justify-content-center gap-5">
                  <Button
                      variant="contained"
                      onClick={() => {
                          if (location.state?.mode) {
                              navigate(-1)
                          } else {
                              navigate("/deadline")
                          }
                      }}
                      className="pascalCase-text dark-bg light-text backButton-AssignmentPage"
                  >
                  Back
                </Button>
                <Button
                      variant="contained"
                      onClick={ViewAssignment}
                      className="pascalCase-text dark-bg light-text backButton-AssignmentPage"
                  >
                  View
                </Button>
                {(currentUser.role==="Student") && <Button
                  variant="contained"
                  style={{ backgroundColor: "#2196f3" }}
                  onClick={SubmitAssignment}
                  className="pascalCase-text green-bg"
                >
                  Submit
                </Button>}
                <div/>
                </div>
                </>
              )
            }
          </div>
        </CardContent>
      </Card>
    </Container>
     :
        <>
            <button className="goBackBtn" style={{top: "12px", left: "60px"}}
                    onClick={() => {
                        navigate(`/AssignmentPage`, {state: {aid: assignment.id}});
                    }}>
                <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
                    <path
                        d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
                </svg>
                <span>Back</span>
            </button>
            <div className="pdf-upload-container mt-5">
                <h3>Upload PDF</h3>
                <form onSubmit={handleSubmitPdf}>
                    <input type="file" accept="application/pdf" onChange={handleFileChangePdf} id="pdfInput"/>
                    <button type="submit">Upload</button>
                </form>
                {file && <p>Selected file: {file.name}</p>}
            </div>
        </>
    }
    </>
  );
};

export default AssignmentPage;
