import NavLeft from "./Components/NavLeft";
import TopBar from "./Components/TopBar";
import MobileNavbar from "./Components/MobileNavbar";
import LoadingPage from "./Components/LoadingPage";
const Dashboard = () => {
    const greeting = "Welcome User!";
    return ( <div>
        <NavLeft />
        <MobileNavbar />
        <TopBar message={greeting}/>
        <LoadingPage />
    </div> );
}
 
export default Dashboard;