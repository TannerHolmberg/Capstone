import React, { useState, useEffect } from "react"; 
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { db } from "./firebase"; 
import NavLeft from "./Components/NavLeft";
import TopBar from "./Components/TopBar";
import MobileNavbar from "./Components/MobileNavbar";
import LoadingPage from "./Components/LoadingPage";
import "./ISDSearchPage.css";
import { Navigate, useNavigate } from "react-router-dom";
const ISDSearchPage = () => {
    const greeting = "Begin by searching for your teachers school district!";

    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [selectedISD, setSelectedISD] = useState(null);
    const Navigate = useNavigate();

        const fetchAllISDs = async () => {
        try {
            const snapshot = await getDocs(collection(db, "isds"));
            const isds = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setResults(isds);
        } catch (error) {
            console.error("Error loading ISDs:", error);
        }
    };

    useEffect(() => {
        fetchAllISDs();
    }, []);

    const normalize = (text) => {
        return text.trim().toLowerCase().replace(/\s+/g, "");
    };

    const handleChange = async (e) => {
        const value = e.target.value;
        setInput(value);
        setSelectedISD(null);

        if (value.length === 0) {
            fetchAllISDs();
            return;
        }

        const normalized = normalize(value);

        try {
            const q = query(
                collection(db, "isds"),
                where("searchKey", ">=", normalized),
                where("searchKey", "<=", normalized + "\uf8ff")
            );

            const querySnapshot = await getDocs(q);
            const matches = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setResults(matches);
        } catch (error) {
            console.error("Error searching ISDs:", error);
        }
    };

    const handleSelect = (isd) => {
        setSelectedISD(isd);
        setInput(isd.displayName);
        Navigate(`/isdteacherlist/${isd.id}`);
        setResults([]);
    };

    return ( <div>
        <NavLeft />
        <MobileNavbar />
        <TopBar message={greeting}/>
        <div className="mobile-top-greeting-isdsearch">
            <h2>Search for Your Teachers ISD</h2>
        </div>
        <div className="Main-container-isdsearch">
            <div className="Inner-container-isdsearch">
                <div id="Search-box-isdsearch" className="login-form">
                    <div className="Search-input-isdsearch">
                        <label>Filter By Typing Name</label>
                        <input onChange={handleChange} type="text" placeholder="Enter School District Name" />
                    </div>
                    <div className="Search-results-isdsearch">
                    <h3>ISDs:</h3>
                    <div className="isd-results-container">
                    {results.length > 0 && (
                            <ul className="isd-dropdown">
                                {results.map((isd) => (
                                    <li className="isd-item"
                                        key={isd.id}
                                        onClick={() => handleSelect(isd)}
                                    >
                                        {isd.displayName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    {results.length === 0 && (<p>No ISDs found.</p>
                    )}
                    </div>
                </div>
                </div>
                
            </div>
        </div>
    </div> );
}
 
export default ISDSearchPage;