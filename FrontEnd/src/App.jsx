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

// Paths that require specific roles (From URL)
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
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const routes = useLocation();

  const fetchCourses = async () => {
    // Fetch courses for the student
    const response = await fetch(`http://localhost:3008/getCourses`, {
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
    // Fetch assignments for the student
    const response = await fetch(`http://localhost:3008/getAssignments/`, {
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
    // Fetch exams for the student
    const response = await fetch(`http://localhost:3008/course-exams/`, {
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
      // fetchExams();
      setExams(INITIAL_EXAMS); // To be replaced with the fetchExams function
    } else {
      setAssignments([]);
      setExams([]);
    }
    setLoading(false);
  };

  // Fetch courses / assignments / exams from the database
  useEffect(() => {
    fetchAll();
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
    // Disable loader when the page is loaded (if it was loading)
    loading && setLoading(false);

    // Limit access to specific routes based on user role
    const pathRole = pathsRoleBased.find((e) => e.path.test(routes.pathname));

    if (
      currentUser.role &&
      pathRole &&
      !pathRole.roles.includes(currentUser.role.toLowerCase())
    ) {
      showMessage("You are not authorized to access this page", true);
      navigate("/");
    }

    // Redirect to previous route if the user is already authenticated
    if (
      pathsNotRequireAuthentication.includes(routes.pathname) &&
      isAuthenticated
    ) {
      showMessage("You are already logged in", true);
      navigate("/");
    }

    // Redirect to login page if the user is not authenticated
    if (
      pathsRequireAuthentication.includes(routes.pathname) &&
      !isAuthenticated
    ) {
      showMessage("You must login first", true);
      navigate("/login");
    }

    // Hide header and footer for specific pages
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

  const addCourseHandler = (newCourse) => {
    setCourses((prevState) => {
      return [...prevState, newCourse];
    });
  };
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
        materials,
        studentsList,
        INITIAL_MATERIALS,
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
                    addCourseHandler={addCourseHandler}
                  />
                }
              />
              <Route
                path="/MyCourses"
                element={
                  <CoursesPage
                    mode="MyCourses"
                    courses={myCourses}
                    addCourseHandler={addCourseHandler}
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
              <Route path="/ViewPdf/:url/:title" element={<PdfViewer />} />
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

const INITIAL_COURSES = [
  {
    id: "e55d8be9-d517-4fdb-a813-7314410d920f",
    title: "html&css",
    desc: "basics of frontend",
    hours: 2,
  },
  {
    id: "6ad77ebe-1397-4903-8360-ad58a9d18679",
    title: "js",
    desc: "javascript content",
    hours: 3,
  },
  {
    id: "ae1ebe8c-143d-460a-9452-50597ff2a790",
    title: "react",
    desc: "important of react",
    hours: 4,
  },
  {
    id: "d3db210c-ab71-46b4-8f0d-bf028f6be506",
    title: "node.js",
    desc: "basics of backend",
    hours: 5,
  },
];
const INITIAL_MY_COURSES = [
  {
    id: "e55d8be9-d517-4fdb-a813-7314410d920f",
    title: "html&css",
    desc: "basics of frontend",
    hours: 2,
  },
];

const INITIAL_ASSIGNMENTS = [
  {
    id: "8c75ead5-1d28-4168-afe4-896ec95ae7e3",
    title: "Assignment 1",
    courseID: "ae1ebe8c-143d-460a-9452-50597ff2a790",
    startDate: "2024-09-28",
    endDate: "2024-10-01",
    duration: "76", // Duration in hours
    document: null,
    description: "This is a React assignment",
  },
  {
    id: "263b8b3d-9b82-4512-8392-5b1971fdba39",
    title: "Assignment 2",
    courseID: "d3db210c-ab71-46b4-8f0d-bf028f6be506",
    startDate: "2024-09-28",
    endDate: "2024-09-30",
    duration: "48", // Duration in hours
    document: null,
    description: "This is a Node.js assignment",
  },
];

const INITIAL_EXAMS = [
  {
    id: "994dd950-6315-4351-b4f9-01b446613dec",
    title: "Midterm Exam",
    courseID: "6ad77ebe-1397-4903-8360-ad58a9d18679",
    dueDate: "2024-09-30",
    description: "This is a React assignment",
  },
  {
    id: "a6bc188c-0cac-4407-9ac7-da47f1b66d4c",
    title: "Final Exam",
    courseID: "e55d8be9-d517-4fdb-a813-7314410d920f",
    dueDate: "2024-10-05",
    description: "This is a Node.js assignment",
  },
];

const INITIAL_MATERIALS = [
  {
    id: 1,
    materialType: "exam",
    submitted: false,
    solve: false,
    instructorName: "Dr. John Doe",
    title: "Midterm Exam",
    startDate: "27 Jun 24",
    endDate: "3 Jul 24",
  },
  {
    id: 2,
    materialType: "assignment",
    submitted: false,
    solve: false,
    instructorName: "Dr. Jane Smith",
    title: "Assignment 1",
    startDate: "2 Jul 24",
    endDate: "2 Aug 24",
  },
  {
    id: 3,
    materialType: "announcement",
    submitted: false,
    solve: false,
    instructorName: "Prof. Michael Brown",
    startDate: "3 Jul 24",
    announcement: "Exam Has Been Postponed to next Tuesday",
  },
  {
    id: 4,
    materialType: "exam",
    submitted: false,
    solve: false,
    instructorName: "Dr. Alice White",
    title: "Final Exam",
    startDate: "3 Aug 24",
    endDate: "3 Sep 24",
  },
  {
    id: 5,
    materialType: "assignment",
    submitted: false,
    solve: false,
    instructorName: "Dr. John Doe",
    title: "Assignment 2",
    startDate: "9 Oct 24",
    endDate: "10 Oct 24",
  },
  {
    id: 6,
    materialType: "announcement",
    submitted: false,
    solve: false,
    instructorName: "Prof. Emily Green",
    startDate: "12 Oct 24",
    announcement: "Grades are Out!",
  },
  {
    id: 7,
    materialType: "exam",
    submitted: false,
    solve: false,
    instructorName: "Dr. Sarah Lee",
    title: "Quiz 1",
    startDate: "10 Nov 24",
    endDate: "11 Nov 24",
  },
  {
    id: 8,
    materialType: "assignment",
    submitted: false,
    solve: false,
    instructorName: "Dr. Jane Smith",
    title: "Assignment 3",
    startDate: "21 Nov 24",
    endDate: "23 Nov 24",
  },
  {
    id: 9,
    materialType: "announcement",
    submitted: false,
    solve: false,
    instructorName: "Prof. David Black",
    startDate: "30 Nov 24",
    announcement: "Check Your Emails.",
  },
  {
    id: 10,
    materialType: "exam",
    submitted: false,
    solve: false,
    instructorName: "Dr. Alice White",
    title: "Midterm Exam 2",
    startDate: "11 Dec 24",
    endDate: "12 Dec 24",
  },
  {
    id: 11,
    materialType: "assignment",
    submitted: false,
    solve: false,
    instructorName: "Dr. Sarah Lee",
    title: "Group Project",
    startDate: "15 Dec 24",
    endDate: "30 Dec 24",
  },
  {
    id: 12,
    materialType: "announcement",
    submitted: false,
    solve: false,
    instructorName: "Prof. Michael Brown",
    startDate: "20 Dec 24",
    announcement: "Grades are Out!",
  },
];

const INITIAL_STUDENTS_LIST = [
  {
    id: 1,
    name: "John Doe",
    username: "john_doe1",
    imgPath: "",
  },
  {
    id: 2,
    name: "Emily Smith",
    username: "emily_smi",
    imgPath: "",
  },
  {
    id: 3,
    name: "Michael Johnson",
    username: "michael_j",
    imgPath: "",
  },
  {
    id: 4,
    name: "Sophia Williams",
    username: "sophia_wi",
    imgPath: "",
  },
  {
    id: 5,
    name: "David Brown",
    username: "david_bro",
    imgPath: "",
  },
  {
    id: 6,
    name: "Olivia Garcia",
    username: "olivia_ga",
    imgPath: "",
  },
  {
    id: "933831c7-41de-4deb-ad57-129d0e9ed3ca",
    name: "Aly Hany",
    username: "alyhany04",
    imgPath: "",
  },
  {
    id: 8,
    name: "Lily Anderson",
    username: "lily_and",
    imgPath: "",
  },
  {
    id: 9,
    name: "James Lee",
    username: "james_lee",
    imgPath: "",
  },
  {
    id: 10,
    name: "Amelia Taylor",
    username: "amelia_ta",
    imgPath: "",
  },
  {
    id: 11,
    name: "Lucas White",
    username: "lucas_whi",
    imgPath: "",
  },
  {
    id: 12,
    name: "Isabella Harris",
    username: "isabella_",
    imgPath: "",
  },
];

const INITIAL_INSTRUCTORS_LIST = [
  {
    id: 1,
    name: "Alice Cooper",
    username: "alice_coo",
    imgPath: "InstructorImg",
  },
  {
    id: 2,
    name: "Bob Johnson",
    username: "bob_johns",
    imgPath: "",
  },
  {
    id: 3,
    name: "Charlie Brown",
    username: "charlie_b",
    imgPath: "",
  },
  {
    id: 4,
    name: "Diane Evans",
    username: "diane_eva",
    imgPath: "",
  },
];

const INITIAL_PROGRESS = [
  {
    id: 1,
    title: "Exam 1",
    course: "React.js",
    isExam: true,
    deadline: "1 Oct 9:00",
    grade: "30",
    isSubmitted: true,
  },
  {
    id: 2,
    title: "Assignment 1",
    course: "js",
    isExam: false,
    deadline: "29 Sep 9:00",
    grade: "",
    isSubmitted: false,
  },
];

export default App;
