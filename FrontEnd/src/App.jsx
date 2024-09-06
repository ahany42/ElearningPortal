import { useState } from "react";
import Login from "./Components/Login/Login.jsx";
import Forgotpassword from "./Components/Forgotpassword/Forgotpassword.jsx";
import Signup from "./Components/Signup/Signup.jsx";
import "./index.css";
import { Routes, Route } from "react-router-dom";
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
            <Route path="/forgot-password" element={<Forgotpassword />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        
     
    </>
  );
}

export default App;
