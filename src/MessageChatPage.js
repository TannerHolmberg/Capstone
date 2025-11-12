import NavLeft from "./Components/NavLeft.js";
import TopBar from "./Components/TopBar.js";
import "./MessageChatPage.css";

function MessageChatPage() {
    return (
        <div>
            <NavLeft />
            <TopBar />
            <div className="Main-container">
                <div className="chat-name-container">
                    <h1>Your Listings</h1>
                </div>
                <div className="chat-box-container">
                    <div className="Chat-box">
                        <p>This is where the chat messages will appear.</p>
                        <div className="chat-input-container">
                            <input type="text" placeholder="Type your message here..." />
                            <button>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageChatPage;