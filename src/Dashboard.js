import NavLeft from "./Components/NavLeft";
import TopBar from "./Components/TopBar";
import MobileNavbar from "./Components/MobileNavbar";
const Dashboard = () => {
    const greeting = "Welcome User!";
    return ( <div>
        <NavLeft />
        <MobileNavbar />
        <TopBar message={greeting}/>
    </div> );
}
 
export default Dashboard;