import "./CreateListingPage.css";
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import { NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { db } from "./firebase.js";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import books from "./images/books.png";
import MobileNavbar from "./Components/MobileNavbar";




function CreateListingPage() {
    const [coords, setCoords] = useState({ lat: null, lng: null });
    const navigate = useNavigate();
    const storage = getStorage();

    const greeting = "Create a new listing!";
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        city: "",
        state: "",
        tags: "",
        lat: coords.lat,
        lng: coords.lng,
    });

    const [images, setImages] = useState([]);

    

    const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    console.log("Form data:", form);
    console.log("Selected images:", images);

    try{
    const auth = getAuth();
    const user = auth.currentUser;

    const uploadPromises = images.map(async (imageFile, index) => {
      const imageRef = ref(
        storage,
        `listings/${user.uid}/${Date.now()}_${index}_${imageFile.name}`
      );
      const snapshot = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    });

    const imageUrls = await Promise.all(uploadPromises);

    // Example of parsing tags into array
    const tagList = form.tags
      ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const listingData = {
      ...form,
      price: Number(form.price),
      tags: tagList,
      location: { city: form.city, state: form.state },
      createdAt: new Date(),
      lat: coords.lat,
      lng: coords.lng,
      images: imageUrls,
    };

    console.log("Ready to upload listing:", listingData);
    // 🔜 next step: upload images to Firebase Storage, then store Firestore doc
    const docRef = await addDoc(collection(db, "listings"), listingData);
    console.log("Created listing with ID:", docRef.id);

    await setDoc(doc(db, "users", user.uid, "listings", docRef.id), {
      listingId: docRef.id,
      createdAt: new Date(),
    });

    Swal.fire({
        title: "Success!",
        text: "Your listing was created successfully.",
        icon: "success",
        showConfirmButton: false,
        timer: 1800,
        backdrop: true,
        }).then(() => {
        navigate("/managelistings");
    });
    } catch (error) {
        console.error("Error creating listing:", error);
        Swal.fire({
            title: "Error",
            text: "There was an issue creating your listing. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
        });
    }
  };

  const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        console.log("User coordinates:", position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please allow location access in your browser.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};

useEffect(() => {
  getLocation();
}, []);


    return (
        <div>
            <MobileNavbar />
            <NavLeft />
            <TopBar message={greeting}/>
            <div className="add-listing-main-content">
                <div className="Header-container">
                    <h1>Add Listings</h1>
                    <img className="listing-pic" src={books} alt="Classroom Connect Logo" />
                </div>
                <div className="listing-form-containter">
                    <form className="listing-form" onSubmit={handleSubmit}>
                        {/* Title */}
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g., Books, Book Shelf, Screen ..."
                            required
                        />

                        {/* Description */}
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe your item or listing..."
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        ></textarea>

                        {/* Price */}
                        <label htmlFor="price">Price ($)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder="e.g., 15"
                            value={form.price}
                            onChange={handleChange}
                            min="0"
                            required
                        />

                        {/* Category */}
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Furnature">Furnature</option>
                            <option value="Decorations">Decorations</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Books">Books</option>
                            <option value="Supplies">Supplies</option>
                            <option value="Misc">Misc</option>
                            <option value="Other">Other</option>
                        </select>

                        {/* Location */}
                        <fieldset className="location-fieldset">
                            <legend>Location</legend>
                            <label htmlFor="city">City</label>
                            <br></br>
                            <input
                            type="text"
                            id="city"
                            name="city"
                            placeholder="e.g., Fort Worth"
                            value={form.city}
                            onChange={handleChange}
                            required
                            />

                            <label htmlFor="state">State</label>
                            <br></br>
                            <input
                            type="text"
                            id="state"
                            name="state"
                            placeholder="e.g., TX"
                            value={form.state}
                            onChange={handleChange} 
                            required
                            />
                        </fieldset>

                        {/* Tags */}
                        <label htmlFor="tags">Tags (comma separated)</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="e.g., black, wooden, large"
                        />

                        {/* Image Upload */}
                        <label htmlFor="images">Upload Images</label>
                        <input
                            type="file"
                            id="images"
                            name="images"
                            accept="image/*"
                            onChange={handleImageChange}
                            multiple
                            required
                        />
                        
                        {/* Submit */}
                        <button type="submit">Create Listing</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateListingPage;