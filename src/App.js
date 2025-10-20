import React, { useState } from "react";
import { auth } from "./firebase";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import MapPage from './MapPage';
import Dashboard from "./Dashboard";
import ManageListingPage from "./ManageListingPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/managelistings" element={<ManageListingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
