import NavLeft from "./Components/NavLeft";
import TopBar from "./Components/TopBar";
import MobileNavbar from "./Components/MobileNavbar";
import LoadingPage from "./Components/LoadingPage";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase"; // your firebase config file
import "./ChatOverview.css";

const ChatOverview = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(chats);
    }, [chats]);

    useEffect(() => {
    const fetchChats = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const uid = user.uid;

      // reference: /users/<uid>/chats
      const chatsRef = collection(db, "users", uid, "chats");
      const snapshot = await getDocs(chatsRef);

      let chatList = [];

      for (let chatDoc of snapshot.docs) {
        const chatData = chatDoc.data();
        console.log("TESTING CHAT DATA:");
        console.log(chatData);

        // -------- GET OTHER USER'S NAME --------
        const otherUserRef = doc(db, "users", chatData.otherUser);
        const otherUserSnap = await getDoc(otherUserRef);

        let displayName = "Unknown User";

        if (otherUserSnap.exists()) {
          const { firstName, lastName } = otherUserSnap.data();
          displayName = `${firstName} ${lastName}`;
        }

        chatList.push({
          id: chatDoc.id,
          name: displayName,
          lastMessage: chatData.lastMessage,
          otherUserUID: chatData.otherUser,
          timestamp: chatData.timestamp
        });
      }

      setChats(chatList);
      setLoading(false);

    };

    fetchChats();
  }, []);

  const setTimeCheck = async (chatId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const uid = user.uid;
    await setDoc(
      doc(db, "messages", chatId),
      {
        [`${uid}_lastSeenAt`]: serverTimestamp(),
      },
      { merge: true } // keeps existing data
    );
  } catch (error) {
    console.error("Error updating last seen:", error);
  }
  }

    const greeting = "Chat Overview";

    if (loading) {
    return <LoadingPage />; // or a custom div with loader.gif
  }
    return (
    <div>
      <NavLeft />
      <MobileNavbar />
      <TopBar message={greeting} />
      
      <div className="add-listing-main-content">
      <div className="mobile-header-chatoverview">
        <h2>Your Messages</h2>
      </div>
      <div className="chat-overview-container">
      {chats.length === 0 && <p>No chats yet.</p>}

      {chats.map((chat) => (
        <div
          key={chat.id}
          className="chat-card"
          onClick={() => {setTimeCheck(chat.id);
            navigate(`/messagechat/${chat.id}`)}}
        >
          <strong className="chat-card-name">{chat.name}</strong>
          <p className="chat-card-last-message">{chat.lastMessage}</p>
        </div>
      ))}
      </div>
      </div>
    </div>
  );
};
 
export default ChatOverview;