import "./ProfilePage.css";
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import { useParams } from "react-router-dom";
import { db, auth } from "./firebase";
import { NavLink } from "react-router-dom";
import { collection, getDocs, doc, getDoc, setDoc,  deleteDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MobileNavbar from "./Components/MobileNavbar";
import React, { useState, useEffect } from "react";
import ChalkTray from "./Components/ChalkTray";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function ProfilePage() {
  const greeting = "Edit Profile";

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const auth = getAuth();
  const storage = getStorage();


//LOAD PROFILE ON PAGE LOAD
  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const profileRef = doc(db, "users", user.uid, "profile", "info");
      const snap = await getDoc(profileRef);

      if (snap.exists()) {
        const data = snap.data();
        setDisplayName(data.displayName || "");
        setBio(data.bio || "");
        setProfileImage(data.photoURL || "");
      }
    };

    loadProfile();
  }, []);

// IMG Selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setProfileImage(URL.createObjectURL(e.target.files[0])); // preview
    }
  };

 // SAVE PROFILE TO FIREBASE
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    let photoURL = profileImage;

    // Upload image if a new one was selected
    if (imageFile) {
      const imageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(imageRef, imageFile);
      photoURL = await getDownloadURL(imageRef);
    }

    const profileData = {
      displayName,
      bio,
      photoURL,
      updatedAt: new Date(),
    };

    await setDoc(
      doc(db, "users", user.uid, "profile", "info"),
      profileData,
      { merge: true }
    );

    alert("Profile saved successfully!");
  };

  return (
    <div>
      <MobileNavbar />
      <NavLeft />
      <TopBar message={greeting} />

      <div className="profile-main-container">
        <div className="profile-card">
          {/* Profile Picture */}
          <div className="profile-image-section">
            <img
              src={profileImage || "/default-avatar.png"}
              // alt="Profile" (need to make its own container and probably move it around. looks ugly if allowed to stay)
              className="profile-image"
            />
            <label className="upload-btn">
              Change Photo
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </label>
          </div>

          {/* Profile Fields */}
          <div className="profile-fields">
            <label>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <label>About You</label>
            <textarea
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Navigation */}
          <div className="profile-actions">
            <NavLink to="/managelistings" className="profile-link-btn">
              My Listings
            </NavLink>
            <NavLink to="/managewishlists" className="profile-link-btn">
              My Wishlists
            </NavLink>
          </div>

          <button className="save-profile-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>

      <ChalkTray />
    </div>
  );
}

export default ProfilePage;