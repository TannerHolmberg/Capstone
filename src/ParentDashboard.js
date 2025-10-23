import NavLeft from "./Components/NavLeft";
import TopBar from "./Components/TopBar";
import MobileNavbar from "./Components/MobileNavbar";

const ParentDashboard = () => {
    return ( 
        <div>
            <NavLeft />
            <MobileNavbar />
            <TopBar message={"Welcome Parent!"}/>
        </div>
     );
}
 
export default ParentDashboard;