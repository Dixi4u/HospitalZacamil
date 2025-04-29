import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Doctores from "./pages/Doctors";
import PasswordRecovery from "./pages/PasswordRecovery";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/doctores" element={<Doctores />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
