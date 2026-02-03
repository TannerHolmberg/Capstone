import React, { useState, useEffect } from "react"; 
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { db } from "./firebase"; 
import { useParams } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import NavLeft from "./Components/NavLeft";
import TopBar from "./Components/TopBar";
import MobileNavbar from "./Components/MobileNavbar";
import LoadingPage from "./Components/LoadingPage";
import "./ISDSearchPage.css";
const ISDTeacherList = () => {
    const greeting = "Select a teacher from the list below:";

    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const { isdName } = useParams();
    const Navigate = useNavigate();


    const fetchAllTeachers = async (isdName) => {
        try {
            const q = query(
            collection(db, "teachers"),
            where("isdName", "==", isdName)
            );

            const snapshot = await getDocs(q);

            const teachers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
            }));

            setResults(teachers);
            console.log(teachers);
        } catch (error) {
            console.error("Error loading teachers:", error);
        }
    };

    useEffect(() => {
        if(!isdName) return;
        fetchAllTeachers(isdName);
    }, [isdName]);

    const normalize = (text) => {
        return text.trim().toLowerCase().replace(/\s+/g, "");
    };

    const handleChange = async (e) => {
        const value = e.target.value;
        setInput(value);
        setSelectedTeacher(null);

        if (value.length === 0) {
            fetchAllTeachers(isdName);
            return;
        }

        const normalized = normalize(value);

        try {
            const q = query(
                collection(db, "teachers"),
                where("searchName", ">=", normalized),
                where("searchName", "<=", normalized + "\uf8ff")
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

    const handleSelect = (teacher) => {
        Navigate(`/searchprofile/${teacher.id}`);
        setResults([]);
    };

    return ( <div>
        <NavLeft />
        <MobileNavbar />
        <TopBar message={greeting}/>
        <div className="mobile-top-greeting-isdsearch">
            <h2>Search for Your Teacher<br/><br/></h2>
        </div>
        <div className="Main-container-isdsearch">
            <div className="Inner-container-isdsearch">
                <div id="Search-box-isdsearch" className="login-form">
                    <div className="Search-input-isdsearch">
                        <label>Filter By Typing Name</label>
                        <input onChange={handleChange} type="text" placeholder="Enter Teachers Name" />
                    </div>
                    <div className="Search-results-isdsearch">
                    <h3>Teachers:</h3>
                    <div className="isd-results-container">
                    {results.length > 0 && (
                            <ul className="isd-dropdown">
                                {results.map((teacher) => (
                                    <li className="isd-item"
                                        key={teacher.id}
                                        onClick={() => handleSelect(teacher)}
                                    >
                                        {teacher.teacherName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    {results.length === 0 && (<p>No Teachers found.</p>
                    )}
                    </div>
                </div>
                </div>
                
            </div>
        </div>
    </div> );
}
 
export default ISDTeacherList;