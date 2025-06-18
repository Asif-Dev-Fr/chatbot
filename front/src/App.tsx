import React from "react";
import Home from "./pages/home/Home";
import LoginView from "./pages/Login/LoginView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupView from "./pages/Signup/SignupView";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/signup" element={<SignupView />} />
      </Routes>
    </Router>
  );
};

export default App;
