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
import "./index.css";
import {
  Routes,
  Route,
  useLocation,
  useNavigate
} from "react-router-dom";
import NotFoundImg from "./assets/404.svg";
import Placeholder from "./Components/Placeholder/Placeholder.jsx";
import "./App.css";
import Header from "./Components/Header/Header.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Components/Footer/Footer.jsx";
import {
  checkCookieExpiry,
  getCookie,
} from "./Components/Cookie/Cookie.jsx";
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
import ENV from "../Front_ENV.jsx"; // To Be Used Later
import AddMaterial from "./Components/AddMaterial/AddMaterial.jsx";
const pathsWithNoHeaderAndFooter = [
    // "/ForgetPassword",
];

const pathsRequireAuthentication = [
  "/MyCourses",
  "/logout",
  "/deadline",
  // '/Courses'
];

const pathsNotRequireAuthentication = [
    '/login',
    '/ForgetPassword',
    '/SignUp',
    '/ResetPassword',
];

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

const INITIAL_ASSIGNMENTS = [
  {
    id: "8c75ead5-1d28-4168-afe4-896ec95ae7e3",
    title: "Assignment 1",
    courseID: "ae1ebe8c-143d-460a-9452-50597ff2a790",
    dueDate: "2024-09-30",
    description: "This is a React assignment",
  },
  {
    id: "263b8b3d-9b82-4512-8392-5b1971fdba39",
    title: "Assignment 2",
    courseID: "d3db210c-ab71-46b4-8f0d-bf028f6be506",
    dueDate: "2024-10-05",
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
const INITIAL_MATERIALS =[
  {
    id: 1,
    materialType: 'exam',
    submitted: false,
    solve: false,
    instructorName: 'Dr. John Doe',
    title: 'Midterm Exam',
    startDate: '2024-10-10',
    endDate: '2024-10-15'
  },
  {
    id: 2,
    materialType: 'assignment',
    submitted: false,
    solve: false,
    instructorName: 'Dr. Jane Smith',
    title: 'Assignment 1',
    startDate: '2024-10-05',
    endDate: '2024-10-12'
  },
  {
    id: 3,
    materialType: 'announcement',
    submitted: false,
    solve: false,
    instructorName: 'Prof. Michael Brown',
    title: "",
    startDate: '2024-10-01'
  },
  {
    id: 4,
    materialType: 'exam',
    submitted: false,
    solve: false,
    instructorName: 'Dr. Alice White',
    title: 'Final Exam',
    startDate: '2024-12-01',
    endDate: '2024-12-05'
  },
  {
    id: 5,
    materialType: 'assignment',
    submitted: false,
    solve: false,
    instructorName: 'Dr. John Doe',
    title: 'Assignment 2',
    startDate: '2024-10-15',
    endDate: '2024-10-22'
  },
  {
    id: 6,
    materialType: 'announcement',
    submitted: false,
    solve: false,
    instructorName: 'Prof. Emily Green',
    title: '',
    startDate: '2024-10-03'
  },
  {
    id: 7,
    materialType: 'exam',
    submitted: false,
    solve: false,
    instructorName: 'Dr. Sarah Lee',
    title: 'Quiz 1',
    startDate: '2024-11-05',
    endDate: '2024-11-07'
  },
  {
    id: 8,
    materialType: 'assignment',
    submitted: false,
    solve: false,
    instructorName: 'Dr. Jane Smith',
    title: 'Assignment 3',
    startDate: '2024-11-10',
    endDate: '2024-11-17'
  },
  {
    id: 9,
    materialType: 'announcement',
    submitted: false,
    solve: false,
    instructorName: 'Prof. David Black',
    title: '',
    startDate: '2024-11-01'
  },
  {
    id: 10,
    materialType: 'exam',
    submitted: false,
    solve: false,
    instructorName: 'Dr. Alice White',
    title: 'Midterm Exam 2',
    startDate: '2024-10-25',
    endDate: '2024-10-30'
  },
  {
    id: 11,
    materialType: 'assignment',
    submitted: false,
    solve: false,
    instructorName: 'Dr. Sarah Lee',
    title: 'Group Project',
    startDate: '2024-11-20',
    endDate: '2024-12-01'
  },
  {
    id: 12,
    materialType: 'announcement',
    submitted: false,
    solve: false,
    instructorName: 'Prof. Michael Brown',
    title: '',
    startDate: '2024-11-15'
  }
];
export const CurrentUserContext = createContext();

let messagesList = [];

function App() {
    const [ showHeaderAndFooter, setShowHeaderAndFooter ] = useState(true);
    const [ courses, setCourses ] = useState(INITIAL_COURSES);
    const [ isAuthenticated, setIsAuthenticated ] = useState(!!getCookie('token'));
    const [ currentUser, setCurrentUser ] = useState({});
    const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS)
    const [exams, setExams] = useState(INITIAL_EXAMS)
    const [materials, setMaterials] = useState(INITIAL_MATERIALS)
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();
    const routes = useLocation();

    useEffect(() => {
        let interval = null;
        if ( isAuthenticated ) {
            setCurrentUser(jwtDecode(getCookie('token')));
            interval = setInterval(async () => {
                if (!getCookie('token')) {
                    setIsAuthenticated(false);
                    setCurrentUser({});
                    clearInterval(interval);
                    showMessage('Session Expired, please login again', true);
                    navigate('/login');
                    return;
                }
                if (checkCookieExpiry('token')) {
                    setIsAuthenticated(false);
                    setCurrentUser({});
                    await axios.post('http://localhost:3008/logout');
                    showMessage('Session Expired, please login again', true);
                    navigate('/login');
                }
            }, 1000);
        } else {
            setCurrentUser({})
            axios.post('http://localhost:3008/logout');
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isAuthenticated])

    useEffect(() => {

        // Disable loader when the page is loaded
        setLoading(false);

        // Redirect to previous route if the user is already authenticated
        if (pathsNotRequireAuthentication.includes(routes.pathname) && isAuthenticated) {
            showMessage('You are already logged in', true);
            navigate("/");
        }

        // Redirect to login page if the user is not authenticated
        if (pathsRequireAuthentication.includes(routes.pathname) && !isAuthenticated) {
            showMessage('You must login first', true);
            navigate('/login');
        }

        // Hide header and footer for specific pages
        if(pathsWithNoHeaderAndFooter.includes(routes.pathname) ||
            document.querySelector('.body-content').innerHTML.includes('Page Not Found')) {
            setShowHeaderAndFooter(false);
        } else {
            setShowHeaderAndFooter(true);
        }
    }, [routes]);

    const addCourseHandler = (newCourse) => {
        setCourses((prevState) => {
            return [...prevState, newCourse]
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
    }

    return (
      <CurrentUserContext.Provider
        value={{
            currentUser, setCurrentUser,
            isAuthenticated, showMessage,
            setIsAuthenticated, courses,
            setCourses, setLoading,
            setAssignments, setExams,materials
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
                  path="/deadline"
                  element={<DeadlinesPage assignments={assignments} exams={exams} />}
                />
                <Route path="/CourseDetails/:id" element={<CourseDetails materials={materials}/>} />
                <Route path="/StudentsList/:id" element={<StudentList />} />
                <Route path="/InstructorsList/:id" element={<InstructorsList />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/AddMaterial/:id" element={<AddMaterial />} />
                <Route path="/AddExam/:id" element={<AddExam courses={courses}/>} />
                <Route path="/AddAnnouncement/:id" element={<AddAnnouncement courses={courses}/>} />
                <Route path="/AddAssignment/:id" element={<AddAssignment courses={courses} />} />
                <Route
                  path="/AssignmentPage"
                  element={<AssignmentPage assignments={assignments} />}
                />
                <Route path="/ExamPage" element={<ExamPage exams={exams} />} />
                <Route path="/ViewProgress/:id" element={<StudentProgress/>} />
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

export default App;
