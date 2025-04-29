import React from "react";
import { Routes, Route } from "react-router-dom";
import Doctors from "./pages/Doctors";
import PasswordRecovery from './pages/PasswordRecovery';
import Login from './pages/Login';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
