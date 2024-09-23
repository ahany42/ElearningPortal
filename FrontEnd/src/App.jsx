import {useEffect, useState} from "react";
import Login from "./Components/Login/Login.jsx";
import CoursesPage from "./Components/CoursesPage/CoursesPage.jsx";
import DeadlinesPage from "./Components/DeadlinesPage/DeadlinesPage.jsx";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword.jsx";
import SignUp from "./Components/Signup/Signup.jsx";
import "./index.css";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import  NotFoundImg from './assets/404.svg';
import Placeholder from "./Components/Placeholder/Placeholder.jsx";
import "./App.css";
import Header from "./Components/Header/Header.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./Components/Footer/Footer.jsx";
import { checkCookieExpiry, getCookie } from "./Components/Cookie/Cookie.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import HomePage from "./Components/HomePage/HomePage.jsx";
import CourseDetails from "./Components/CourseDetails/CourseDetails.jsx";

const pathsWithNoHeaderAndFooter = [
    '/ForgetPassword',
    '/SignUp',
];

const pathsRequireAuthentication = [
    '/MyCourses',
    '/logout',
    '/Deadline',
    //for testing only
    // '/Courses'
];

const pathsNotRequireAuthentication = [
    '/login',
    '/ForgetPassword',
    '/SignUp',
];

let data = [
  {
    id: Math.random(Math.floor() * 100),
    title: "html&css",
    desc: "basics of frontend",
    hours: 2,
  },
  {
    id: Math.random(Math.floor() * 100),
    title: "js",
    desc: "javascript content",
    hours: 3,
  },
  {
    id: Math.random(Math.floor() * 100),
    title: "react",
    desc: "important of react",
    hours: 4,
  },
  {
    id: Math.random(Math.floor() * 100),
    title: "node.js",
    desc: "basics of backend",
    hours: 5,
  },
];

function App() {
    const routes = useLocation();
    const [ showHeaderAndFooter, setShowHeaderAndFooter ] = useState(true);
    const [ courses, setCourses ]=useState(data);
    const [ isAuthenticated, setIsAuthenticated ] = useState(!!getCookie('token'));
    const [ activeErrors, setActiveErrors ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let interval = null;
        if ( isAuthenticated ) {
            interval = setInterval(async () => {
                if (!getCookie('token')) {
                    setIsAuthenticated(false);
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

    return (
      <div className="body-container">
          { showHeaderAndFooter && <Header/> }
          <div className={"body-content" + (routes.pathname !== "/" ? " mt-5" : "")}>
              <ToastContainer style={{width: 'fit-content'}}/>
              <Routes>
                  <Route path="/" element={<HomePage/>}/>
                  <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
                  <Route path="/ForgetPassword" element={<ForgotPassword/>}/>
                  <Route path="/SignUp" element={<SignUp/>}/>
                  <Route path="/courses"
                         element={<CoursesPage courses={courses} addCourseHandler={addCourseHandler}
                                               isAuthenticated={isAuthenticated}/>}/>
                  <Route path="/deadline" element={<DeadlinesPage/>}/>
                  <Route path="/CourseDetails/:id" element={<CourseDetails/>}/>
                  <Route path="*" element={
                      <Placeholder text="Page Not Found" img={NotFoundImg} buttonText="Back To Home" buttonRoute="/"/>
                  }
                  />
              </Routes>
          </div>

          {showHeaderAndFooter && <Footer/>}
      </div>
    );
}

export default App;
