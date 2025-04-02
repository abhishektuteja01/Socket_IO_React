import { useEffect, useState } from "react";
import socket from "./socket/MySocket.js";

export default function App() { 
  const [messageHistory, setmessageHistory] = useState([]);
  const [username, setUsername] = useState('');

  const handleSendMessage = (event) => {
    event.preventDefault();
    const input = event.target.elements.msg;
    const message = {
      text: input.value,
      sender: username,
      timestamp: new Date().toISOString(),
    };
    socket.emit("message", message);
    input.value = "";
  };

  useEffect(() => {
    socket.on("assignUsername", (assignedUsername) => {
      setUsername(assignedUsername);
    });

    socket.on("message", (message) => {
      console.log("Message from server:", message);
      setmessageHistory((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
      socket.off("assignUsername");
    };
  }, []);

  return (
    <div className="chat-container">
      <h1 className="chat-header">Socket.IO Chat</h1>
      <div className="chat-messages">
        <h2>Messages</h2>
        <ul>
          {messageHistory.map((msg, index) => (
            <li key={index}>
              › <strong>{msg.sender}</strong> @ {new Date(msg.timestamp).toLocaleTimeString()}: {msg.text}
            </li>
          ))}
        </ul>
      </div>
      <form id="form" className="chat-input" onSubmit={handleSendMessage}>
        <input id="input" autoComplete="off" name="msg" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};