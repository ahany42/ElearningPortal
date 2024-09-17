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
    const [filter, setFilter] = useState("");


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
        const filterHandler = ( courses) => {
          if (!courses) {
          return [];
          }
          if (!filter) {
          return courses
          }
          return courses.filter((el) =>
            el.title.toLowerCase().includes(filter.toLowerCase())
          );
        };

    return (
      <div className="body-container">
        {showHeaderAndFooter && <Header />}
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
                <>
                  <input
                    style={{
                      backgroundColor: "#616161",
                      opacity: "0.7",
                      border: "grey solid 3px",
                      borderRadius: "10%",
                      width: "fit-content",
                      margin: "auto",
                    }}
                    type="text"
                    placeholder="Search"
                    id="filter"
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  <Coursescards
                    courses={courses}
                    addCourseHandler={addCourseHandler}
                    filterHandler={filterHandler}
                  />
                </>
              }
            />
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
        </div>

        {showHeaderAndFooter && <Footer />}
      </div>
    );
}

export default App;
