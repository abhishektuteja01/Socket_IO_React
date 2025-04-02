import { useEffect } from "react";
import socket from "./socket/MySocket.js";
import { useState } from "react";


export default function App() { 
  const [messageHistory, setmessageHistory] = useState([]);
  const handleSendMessage = (event) => {
    event.preventDefault();
    const input = event.target.elements.msg;
    const message = {
      text: input.value,
      senderId: socket.id,
      timestamp: new Date().toISOString(),
    };
    socket.emit("message", message);
    input.value = "";
  };

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("Message from server:", message);
      setmessageHistory((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
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
              › <strong>{msg.senderId}</strong> @ {new Date(msg.timestamp).toLocaleTimeString()}: {msg.text}
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