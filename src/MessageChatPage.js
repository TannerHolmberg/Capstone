import NavLeft from "./Components/NavLeft.js";
import TopBar from "./Components/TopBar.js";
import MobileNavbar from "./Components/MobileNavbar.js";
import { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";
import { useParams } from "react-router-dom";
import "./MessageChatPage.css";

function MessageChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [otherUserName, setOtherUserName] = useState("Message User");
  const user = auth.currentUser;
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages
  useEffect(() => {
    if (!chatId || !user) return;

    const messagesRef = collection(db, "messages", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [chatId, user]);

  // Fetch other user's name
  useEffect(() => {
    if (!chatId || !user) return;

    const fetchOtherUser = async () => {
      const chatDocRef = doc(db, "messages", chatId);
      const chatSnap = await getDoc(chatDocRef);
      if (chatSnap.exists()) {
        const chatData = chatSnap.data();
        const otherUID = chatData.users.find(uid => uid !== user.uid);

        const otherUserRef = doc(db, "users", otherUID);
        const otherUserSnap = await getDoc(otherUserRef);
        if (otherUserSnap.exists()) {
          const { firstName, lastName } = otherUserSnap.data();
          setOtherUserName(`${firstName} ${lastName}`);
        }
      }
    };

    fetchOtherUser();
  }, [chatId, user]);

  const handleSendMessage = async () => {
    if (!typedMessage.trim()) return;

    const messagesRef = collection(db, "messages", chatId, "messages");

    await addDoc(messagesRef, {
      text: typedMessage,
      sender: user.uid,
      timestamp: serverTimestamp()
    });

    const chatDocRef = doc(db, "users", user.uid, "chats", chatId);
    await setDoc(chatDocRef, {
      lastMessage: typedMessage,
      timestamp: serverTimestamp()
    }, { merge: true });

    setTypedMessage("");
  };

  return (
    <div>
      <NavLeft />
      <MobileNavbar />
      <TopBar message={"Message User"} />
      <div className="Main-container">
        <div className="chat-name-container">
          <h1>{otherUserName}</h1>
        </div>
        <div className="chat-box-container">
          <div className="Chat-box">
            <div className="messages-container">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={msg.sender === user.uid ? "my-message" : "their-message"}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <input
                type="text"
                placeholder="Type your message here..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageChatPage;
