import { useState } from "react";
import Login from "./Components/Login/Login.jsx";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword.jsx";
import SignUp from "./Components/SignUp/SignUp.jsx";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import  NotFoundImg from './assets/404.svg';
import Placeholder from "./Components/Placeholder/Placeholder.jsx";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="blue-text alignCenter-text">App Component</h1>
      <h1 className="green-text alignCenter-text">App Component</h1>
      <h1 className="alignCenter-text">App Component</h1>
      <h1 className="light-text dark-bg alignCenter-text">App Component</h1>
       
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/ForgetPassword" element={<ForgotPassword />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path='/*' element={<Placeholder img={NotFoundImg} text="Page Not Found"/>}/>
          </Routes>
        
     
    </>
  );
}

export default App;
