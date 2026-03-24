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
import CreateListingPage from "./CreateListingPage";
import ManageWishlistPage from "./ManageWishlistPage";
import AddWishlistPage from "./AddWishlistPage";
import ParentDashboard from "./ParentDashboard";
import MessageChatPage from "./MessageChatPage";
import ChatOverview from "./ChatOverview";
import ProfilePage from "./ProfilePage";
import ISDSearchPage from "./ISDSearchPage";
import ISDTeacherList from "./ISDTeacherList";
import SearchProfile from "./SearchProfile";
import RequireTeacher from "./RequireTeacher";
function App() {
  return (
    <Router>
      <Routes>
        {/* Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/map" element={<RequireTeacher><MapPage /></RequireTeacher>} />
        <Route path="/dashboard" element={<RequireTeacher><Dashboard /></RequireTeacher>} />
        <Route path="/managelistings" element={<RequireTeacher><ManageListingPage /></RequireTeacher>} />
        <Route path="/createlisting" element={<RequireTeacher><CreateListingPage /></RequireTeacher>} />
        <Route path="/managewishlists" element={<RequireTeacher><ManageWishlistPage /></RequireTeacher>} />
        <Route path="/addwishlist" element={<RequireTeacher><AddWishlistPage /></RequireTeacher>} />
        <Route path="/parentdashboard" element={<ParentDashboard />} />
        <Route path="/messagechat/:chatId" element={<MessageChatPage />} />
        <Route path="/chatoverview" element={<ChatOverview />} />
        <Route path="/isdsearch" element={<ISDSearchPage />} />
        <Route path="/isdteacherlist/:isdName" element={<ISDTeacherList />} />
        <Route path="/profile/:user" element={<RequireTeacher><ProfilePage /></RequireTeacher>} />
        <Route path="/searchprofile/:teacherId" element={<SearchProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
