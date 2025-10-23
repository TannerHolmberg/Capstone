import './TopBar.css';

const TopBar = ({ message }) => {
    return ( 
        <div className="top-bar">
            <h2>{message}</h2>
            <button>Logout</button>
        </div>
     );
}
 
export default TopBar;