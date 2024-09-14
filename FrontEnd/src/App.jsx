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

const pathsWithNoHeaderAndFooter = [
    '/ForgetPassword',
    '/SignUp'
];

function App() {
    const routes = useLocation();
    const [showHeaderAndFooter, setShowHeaderAndFooter] = useState(true);


  useEffect(() => {
        if(pathsWithNoHeaderAndFooter.includes(routes.pathname) ||
            document.querySelector('.body-content').innerHTML.includes('Page Not Found')) {
            setShowHeaderAndFooter(false);
        } else {
            setShowHeaderAndFooter(true);
        }
  }, [routes])

  return (
    <div className='body-container'>
        {showHeaderAndFooter && <Header />}

        <div className='body-content'>
            <Routes>
                <Route path="/" element={<><Login /></>} />
                <Route path="/ForgetPassword" element={<ForgotPassword />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path='*'  element={<PageNotFound />}/>
            </Routes>
        </div>

        {showHeaderAndFooter && <Footer/>}
    </div>
  );
}

export default App;
