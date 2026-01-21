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
import ISDSearchPage from "./ISDSearchPage";
import ISDTeacherList from "./ISDTeacherList";
import SearchProfile from "./SearchProfile";
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
        <Route path="/createlisting" element={<CreateListingPage />} />
        <Route path="/managewishlists" element={<ManageWishlistPage />} />
        <Route path="/addwishlist" element={<AddWishlistPage />} />
        <Route path="/parentdashboard" element={<ParentDashboard />} />
        <Route path="/messagechat/:chatId" element={<MessageChatPage />} />
        <Route path="/chatoverview" element={<ChatOverview />} />
        <Route path="/isdsearch" element={<ISDSearchPage />} />
        <Route path="/isdteacherlist/:isdName" element={<ISDTeacherList />} />
        <Route path="/searchprofile/:teacherName" element={<SearchProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
