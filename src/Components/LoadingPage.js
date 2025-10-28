import "./LoadingPage.css";
import loaderGif from "../images/loader.gif";

const LoadingPage = () => {
    return ( 
        <div className="loading-page">
            <img src={loaderGif} alt="Loading..." />
        </div>
     );
}
 
export default LoadingPage;