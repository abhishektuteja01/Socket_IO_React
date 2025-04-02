import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
socket.on("message", (message) => {
  console.log("Received message:", message);
});
socket.on("error", (error) => {
  console.error("Socket error:", error);
});
socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

export default socket;

