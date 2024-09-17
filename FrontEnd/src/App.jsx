import {useEffect, useState} from "react";
import Login from "./Components/Login/Login.jsx";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword.jsx";
import SignUp from "./Components/SignUp/SignUp.jsx";
import "./index.css";
import {Routes, Route, NavLink, useLocation} from "react-router-dom";
import  NotFoundImg from './assets/404.svg';
import Placeholder from "./Components/Placeholder/Placeholder.jsx";
import "./App.css";
import Header from "./Components/Header/Header.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "@mui/material";
import Footer from "./Components/Footer/Footer.jsx";
import PageNotFound from "./Components/4O4/PageNotFound.jsx";
import Coursescards from "./Components/Coursescards/Coursescards.jsx";

const pathsWithNoHeaderAndFooter = [
    '/ForgetPassword',
    '/SignUp'
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


const addCourse = 
  {
    id: Math.random(Math.floor() * 100),
    title: "php",
    desc: "basics of php",
    hours: 4,
  }

function App() {
    const routes = useLocation();
    const [showHeaderAndFooter, setShowHeaderAndFooter] = useState(true);
    const[courses,setCourses]=useState(data)


    useEffect(() => {
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
        {/* {showHeaderAndFooter && 
      } */}
      <Header />
        <div className="body-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Login />
                </>
              }
            />
            <Route path="/ForgetPassword" element={<ForgotPassword />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route
              path="/courses"
              element={
                <Coursescards
                  courses={courses}
                 addCourseHandler={addCourseHandler}/>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>

        <Footer />
        {/* {showHeaderAndFooter && 
        } */}
      </div>
    );
}

export default App;
