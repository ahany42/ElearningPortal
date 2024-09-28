import { useEffect, useState, createContext } from "react";
import Login from "./Components/Login/Login.jsx";
import CoursesPage from "./Components/CoursesPage/CoursesPage.jsx";
import DeadlinesPage from "./Components/DeadlinesPage/DeadlinesPage.jsx";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword.jsx";
import { v4 as uuidv4 } from "uuid";
import SignUp from "./Components/Signup/Signup.jsx";
import "./index.css";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import NotFoundImg from "./assets/404.svg";
import Placeholder from "./Components/Placeholder/Placeholder.jsx";
import "./App.css";
import Header from "./Components/Header/Header.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Components/Footer/Footer.jsx";
import {
  checkCookieExpiry,
  deleteCookie,
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
const pathsWithNoHeaderAndFooter = [
    // "/ForgetPassword",
];

const pathsRequireAuthentication = [
  "/MyCourses",
  "/logout",
  "/Deadline",
  // '/Courses'
];

const pathsNotRequireAuthentication = [
    '/login',
    '/ForgetPassword',
    '/SignUp',
];

const data = [
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
const tasks = [
  {
    id: uuidv4(),
    title: "Assignment 1",
    course: "React Basics",
    dueDate: "2024-09-30",
    description: "This is a React assignment",
  },
  {
    id: uuidv4(),
    title: "Assignment 2",
    course: "Node.js",
    dueDate: "2024-10-05",
    description: "This is a Node.js assignment",
  },
];

export const CurrentUserContext = createContext();

let messagesList = [];

function App() {
    const [ showHeaderAndFooter, setShowHeaderAndFooter ] = useState(true);
    const [ courses, setCourses ] = useState(data);
    const [ isAuthenticated, setIsAuthenticated ] = useState(!!getCookie('token'));
    const [ currentUser, setCurrentUser ] = useState({});
    const [ activeErrors, setActiveErrors ] = useState([]);
    const [assignments, setAssignments] = useState(tasks)
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
                    if (!activeErrors.includes('Session Expired, please login again')) {
                        setActiveErrors([...activeErrors, 'Session Expired, please login again']);
                        toast.error('Session Expired, please login again', {
                            autoClose: 3000, // Auto close after 3 seconds
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            style: {
                                userSelect: 'none',
                                gap: '10px',
                                padding: '20px',
                            },
                            onClose: () => {
                                setActiveErrors(prevState =>
                                    prevState.filter(e => e !== 'Session Expired, please login again'))
                            }
                        });
                    }
                    navigate('/login');
                    return;
                }
                if (checkCookieExpiry('token')) {
                    setIsAuthenticated(false);
                    setCurrentUser({});
                    await axios.post('http://localhost:3008/logout');
                    if (!activeErrors.includes('Session Expired, please login again')) {
                        setActiveErrors([...activeErrors, 'Session Expired, please login again']);
                        toast.error('Session Expired, please login again', {
                            autoClose: 3000, // Auto close after 3 seconds
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            style: {
                                userSelect: 'none',
                                gap: '10px',
                                padding: '20px',
                            },
                            onClose: () => {
                                setActiveErrors(prevState =>
                                    prevState.filter(e => e !== 'Session Expired, please login again'))
                            }
                        });
                    }
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

        // Redirect to previous route if the user is already authenticated
        if (pathsNotRequireAuthentication.includes(routes.pathname) && isAuthenticated) {
            if (!activeErrors.includes('You are already logged in')) {
                setActiveErrors([...activeErrors, 'You are already logged in']);
                toast.error('You are already logged in', {
                    autoClose: 3000, // Auto close after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                        userSelect: 'none',
                        gap: '10px',
                        padding: '20px',
                    },
                    onClose: () => {
                        setActiveErrors(prevState => prevState.filter(e => e !== 'You are already logged in'))
                    }
                });
            }
            navigate(-1);
        }

        // Redirect to login page if the user is not authenticated
        if (pathsRequireAuthentication.includes(routes.pathname) && !isAuthenticated) {
            if (!activeErrors.includes('You must login first')) {
                setActiveErrors([...activeErrors, 'You must login first']);
                toast.error('You must login first', {
                    autoClose: 3000, // Auto close after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                        userSelect: 'none',
                        gap: '10px',
                        padding: '20px',
                    },
                    onClose: () => {
                        setActiveErrors(prevState => prevState.filter(e => e !== 'You must login first'))
                    }
                });
            }
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
    const addAssignmentHandler=(newAssignment)=>{
        setAssignments([...assignments,newAssignment])
    }


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
        }
    }

    return (
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser,
          isAuthenticated,
          showMessage,
          setIsAuthenticated,
          courses,
          setCourses,
          setLoading,
        }}
      >
        <div className="body-container">
          {showHeaderAndFooter && <Header />}
          <div
            className={
              "body-content" + (routes.pathname !== "/" ? " mt-5" : "")
            }
          >
            <ToastContainer style={{ width: "fit-content" }} />
            {loading ? (
              <Loader />
            ) : (
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/ForgetPassword" element={<ForgotPassword />} />
                <Route path="/resetPassword" element={<ChangePassword />} />
                <Route path="/SignUp" element={<SignUp />} />
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
                  element={<DeadlinesPage assignments={assignments} />}
                />
                <Route path="/CourseDetails/:id" element={<CourseDetails />} />
                <Route path="/AddExam" element={<AddExam />} />
                <Route path="/logout" element={<Logout />} />
                <Route
                path="/AssignmentPage"
                  element={
                    <AssignmentPage
                    addAssignmentHandler={addAssignmentHandler}
                    setAssignments
                    ={setAssignments}/>
                }
                />
                <Route path="/ExamPage" element={<ExamPage />} />
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
