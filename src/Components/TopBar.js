import './TopBar.css';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";


const TopBar = ({ message }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return ( 
        <div className="top-bar">
            <h2>{message}</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
     );
}
 
export default TopBar;