import { useEffect, useState, createContext } from "react";
import Login from "./Components/Login/Login.jsx";
import CoursesPage from "./Components/CoursesPage/CoursesPage.jsx";
import DeadlinesPage from "./Components/DeadlinesPage/DeadlinesPage.jsx";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword.jsx";
import SignUp from "./Components/Signup/Signup.jsx";
import UserProfile from "./Components/UserProfile/UserProfile.jsx";
import StudentList from "./Components/StudentsList/StudentList.jsx";
import InstructorsList from "./Components/InstructorsList/InstructorsList.jsx";
import AddAnnouncement from "./Components/AddAnnouncement/AddAnnouncement.jsx";
import AddAssignment from "./Components/AddAssignment/AddAssignment.jsx";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import NotFoundImg from "./assets/404.svg";
import Placeholder from "./Components/Placeholder/Placeholder.jsx";
import Header from "./Components/Header/Header.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Components/Footer/Footer.jsx";
import { checkCookieExpiry, getCookie } from "./Components/Cookie/Cookie.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import HomePage from "./Components/HomePage/HomePage.jsx";
import CourseDetails from "./Components/CourseDetails/CourseDetails.jsx";
import Logout from "./Components/Logout/Logout.jsx";
import AddExam from "./Components/AddExam/AddExam.jsx";
import ChangePassword from "./Components/ChangePassword/ChangePassword.jsx";
import Loader from "./Components/Loader/Loader.jsx";
import AssignmentPage from "./Components/AssignmentPage/AssignmentPage.jsx";
import ExamPage from "./Components/ExamPage/ExamPage.jsx";
import StudentProgress from "./Components/StudentProgress/StudentProgress.jsx";
import Front_ENV from "../Front_ENV.jsx"; // To Be Used Later
import AddMaterial from "./Components/AddMaterial/AddMaterial.jsx";
import AddInstructor from "./Components/AddInstructor/AddInstructor.jsx";
import InstructorsPage from "./Components/AdminInstructorsPage/AdminInstructorsPage.jsx";
import ExamQuestions from "./Components/SolveExam/ExamQuestions.jsx";
import PdfViewer from "./Components/PDFViewer/PDFViewer.jsx";
import "./App.css";

const pathsWithNoHeaderAndFooter = [
  // "/ForgetPassword",
  // "ViewPdf/:url/:title"
];

const pathsRequireAuthentication = [
  "/MyCourses",
  "/logout",
  "/deadline",
  // '/Courses'
];

const pathsNotRequireAuthentication = [
  "/login",
  "/ForgetPassword",
  "/SignUp",
  "/ResetPassword",
];

const pathsRoleBased = [
  {
    path: /^\/deadline$/,
    roles: "student",
  },
  {
    path: /^\/CourseDetails\/[a-zA-Z0-9\-]+\/InstructorsList$/,
    roles: "student, instructor, admin, superadmin",
  },
  {
    path: /^\/CourseDetails\/[a-zA-Z0-9\-]+\/StudentsList$/,
    roles: "student, instructor, admin, superadmin,student",
  },
  {
    path: /^\/AddAssignment\/[a-zA-Z0-9\-]+$/,
    roles: "instructor, admin, superadmin",
  },
  {
    path: /^\/AddAnnouncement\/[a-zA-Z0-9\-]+$/,
    roles: "instructor, admin, superadmin",
  },
  {
    path: /^\/AddExam\/[a-zA-Z0-9\-]+$/,
    roles: "instructor, admin, superadmin",
  },
  {
    path: /^\/AddMaterial\/[a-zA-Z0-9\-]+$/,
    roles: "instructor, admin, superadmin",
  },
  {
    path: /^\/MyCourses$/,
    roles: "instructor, student",
  },
  {
    path: /^\/ViewProgress\/[a-zA-Z0-9\-]+$/,
    roles: "student, instructor, admin, superadmin",
  },
  {
    path: /^\/AddInstructor$/,
    roles: "admin, superadmin",
  },
  {
    path: /^\/InstructorsPage$/,
    roles: "admin, superadmin",
  },
];

export const CurrentUserContext = createContext();

let messagesList = [];

function App() {
  const [showHeaderAndFooter, setShowHeaderAndFooter] = useState(true);
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCookie("token"));
  const [currentUser, setCurrentUser] = useState(
    getCookie("token") ? jwtDecode(getCookie("token")) : {}
  );
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [instructorsList, setInstructorsList] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const routes = useLocation();

  const fetchCourses = async () => {
    const response = await fetch(`${Front_ENV.Back_Origin}/getCourses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentUser.role ? { userId: currentUser.id } : {}),
    }).then((res) => res.json());
    if (response.data) {
      setCourses(response.data);
      currentUser.role &&
        (currentUser.role.toLowerCase() === "student" ||
          currentUser.role.toLowerCase() === "instructor") &&
        setMyCourses(response.data.filter((e) => e.isEnrolled));
    } else {
      showMessage(response.error, true);
    }
  };

  const fetchAssignments = async () => {
    const response = await fetch(`${Front_ENV.Back_Origin}/getAssignments/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: getCookie("token"),
      },
    }).then((res) => res.json());
    if (response.data) {
      setAssignments(response.data);
    } else {
      showMessage(response.error, true);
    }
  };

  const fetchExams = async () => {
    const response = await fetch(`${Front_ENV.Back_Origin}/course-exams/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: getCookie("token"),
      },
    }).then((res) => res.json());
    if (response.data) {
      setExams(response.data);
    } else {
      showMessage(response.error, true);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await fetchCourses();
    if (currentUser.id) {
      await fetchAssignments();
      setExams(INITIAL_EXAMS);
    } else {
      setAssignments([]);
      setExams([]);
      setMaterials([]);
    }
    setLoading(false);
  };
  useEffect(() => {
    try {
      fetchAll();
    } catch (e) {
        showMessage(e.message, true);
    }
  }, [currentUser]);

  useEffect(() => {
    let interval = null;
    if (isAuthenticated) {
      setCurrentUser(jwtDecode(getCookie("token")));
      interval = setInterval(async () => {
        if (!getCookie("token")) {
          setIsAuthenticated(false);
          setCurrentUser({});
          clearInterval(interval);
          showMessage("Session Expired, please login again", true);
          navigate("/login");
          return;
        }
        if (checkCookieExpiry("token")) {
          setIsAuthenticated(false);
          setCurrentUser({});
          await axios.post("http://localhost:3008/logout");
          showMessage("Session Expired, please login again", true);
          navigate("/login");
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    loading && setLoading(false);
    const pathRole = pathsRoleBased.find((e) => e.path.test(routes.pathname));
    if (
      currentUser.role &&
      pathRole &&
      !pathRole.roles.includes(currentUser.role.toLowerCase())
    ) {
      showMessage("You are not authorized to access this page", true);
      navigate("/");
    }
    if (
      pathsNotRequireAuthentication.includes(routes.pathname) &&
      isAuthenticated
    ) {
      showMessage("You are already logged in", true);
      navigate("/");
    }
    if (
      pathsRequireAuthentication.includes(routes.pathname) &&
      !isAuthenticated
    ) {
      showMessage("You must login first", true);
      navigate("/login");
    }
    if (
      pathsWithNoHeaderAndFooter.includes(routes.pathname) ||
      document
        .querySelector(".body-content")
        .innerHTML.includes("Page Not Found")
    ) {
      setShowHeaderAndFooter(false);
    } else {
      setShowHeaderAndFooter(true);
    }
  }, [routes]);

  const addAssignmentHandler = (newAssignment) => {
    setAssignments((prevState) => {
      return [...prevState, newAssignment];
    });
  };

  const showMessage = (msg, error) => {
    if (msg && (error === true || error === false)) {
      if (!messagesList.includes(msg)) {
        messagesList.push(msg);
        toast[error ? "error" : "success"](msg, {
          autoClose: 3000,
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
            messagesList = messagesList.filter((e) => e !== msg);
          },
        });
      }
    } else if (msg && error === null) {
      if (!messagesList.includes(msg)) {
        messagesList.push(msg);
        toast.info(msg, {
          autoClose: 3000,
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
            messagesList = messagesList.filter((e) => e !== msg);
          },
        });
      }
    }
  };

  const confirmationToast = (confirmationMsg) => {
    return new Promise((resolve) => {
      toast.info(
        <div>
          <h6 className="mb-3">{confirmationMsg}</h6>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => {
                resolve(true);
                toast.dismiss();
              }}
              style={{
                padding: "2px 10px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => {
                resolve(false);
                toast.dismiss();
              }}
              style={{
                padding: "2px 10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>,
        {
          className: "toast-confirm",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            userSelect: "none",
            gap: "10px",
            padding: "20px",
          },
        }
      );
    });
  };
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        showMessage,
        confirmationToast,
        fetchCourses,
        fetchAll,
        setIsAuthenticated,
        courses,
        setCourses,
        setLoading,
        progress,
        instructorsList,
        setAssignments,
        setExams,
        setMaterials,
        materials,
        studentsList,
      }}
    >
      <div className="body-container">
        {showHeaderAndFooter && <Header />}
        <div className="body-content">
          <ToastContainer style={{ width: "fit-content" }} />
          {loading ? (
            <Loader />
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/ForgetPassword" element={<ForgotPassword />} />
              <Route path="/ResetPassword" element={<ChangePassword />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/Profile" element={<UserProfile />} />
              <Route
                path="/courses"
                element={
                  <CoursesPage
                    courses={courses}
                  />
                }
              />
              <Route
                path="/MyCourses"
                element={
                  <CoursesPage
                    mode="MyCourses"
                    courses={myCourses}
                  />
                }
              />
              <Route
                path="/deadline"
                element={
                  <DeadlinesPage assignments={assignments} exams={exams} />
                }
              />
              <Route path="/CourseDetails/:id" element={<CourseDetails />} />
              <Route
                path="/CourseDetails/:id/StudentsList"
                element={<StudentList />}
              />
              <Route
                path="/CourseDetails/:id/InstructorsList"
                element={<InstructorsList />}
              />
              <Route
                path="/CurrentInstructors"
                element={<InstructorsList/>}
              />
              <Route
                path="/AssignInstructor/:CourseId"
                element={<InstructorsList/>}
              />
              <Route path="/logout" element={<Logout />} />
              <Route path="/AddMaterial/:id" element={<AddMaterial />} />
              <Route
                path="/AddExam/:id"
                element={<AddExam courses={courses} />}
              />
              <Route
                path="/examQuestions/:examId"
                element={<ExamQuestions />}
              />
              <Route
                path="/AddAnnouncement/:id"
                element={<AddAnnouncement courses={courses} />}
              />
              <Route
                path="/AddAssignment/:id"
                element={<AddAssignment addHandler={addAssignmentHandler} />}
              />
              <Route
                path="/AssignmentPage"
                element={<AssignmentPage assignments={assignments} />}
              />
              <Route path="/ExamPage" element={<ExamPage exams={exams} />} />
              <Route
                path="/ViewProgress/:id/:name"
                element={<StudentProgress />}
              />{" "}
              <Route path="/ViewProgress" element={<StudentProgress />} />
              <Route path="/ViewPdf/:url/:pdfTitle" element={<PdfViewer />} />
              <Route path="/AddInstructor" element={<AddInstructor />} />
              <Route path="/InstructorsPage" element={<InstructorsPage />} />
              <Route
                path="*"
                element={
                  <Placeholder
                    text="Page Not Found"
                    img={NotFoundImg}
                    buttonText="Back To Home"
                    buttonRoute="/"
                  />
                }
              />
            </Routes>
          )}
        </div>

        {showHeaderAndFooter && <Footer />}
      </div>
    </CurrentUserContext.Provider>
  );
}

const INITIAL_EXAMS = [
  {
    id: "994dd950-6315-4351-b4f9-01b446613dec",
    title: "Midterm Exam",
    courseID: "6ad77ebe-1397-4903-8360-ad58a9d18679",
    dueDate: "2024-09-30",
    startDate: "2024-10-01",
    duration: 60,
    endDate: "2024-10-05",
    description: "This is a midterm exam",
  },
  {
    id: "a6bc188c-0cac-4407-9ac7-da47f1b66d4c",
    title: "Final Exam",
    courseID: "e55d8be9-d517-4fdb-a813-7314410d920f",
    dueDate: "2024-10-05",
    startDate:"2024-10-01",
    duration: 30,
    endDate: "2024-10-05",
    description: "This is a final exam"
  },
  {
    id: "994dd950-6315-4351-b4f9-01b446613e93",
    courseID: "ae1ebe8c-143d-460a-9452-50597ff2a790",
    title: "Midterm Exam 2",
    dueDate: "2024-08-05",
    startDate: "2024-08-15",
    duration: 120,
    endDate: "2024-09-01",
    description: "This is second midterm exam"
  },
  {
    id: "a6bc188c-0cac-4407-9ac7-da47f1b66d7e",
    courseID: "ae1ebe8c-143d-460a-9452-50597ff2a790",
    title: "Final Exam 2",
    dueDate: "2024-10-05",
    startDate: "2024-10-08",
    duration: 90,
    endDate: "2024-10-05",
    description: "This is second final exam"
  }
];

export default App;
