import { useEffect, useState } from "react";
import "./App.css";
import { useSocket } from "./context/socketProvider";

function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");
  const socket = useSocket();
  console.log(socket);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("receive-message", (data) => {
      setMessages((message) => [...message, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      <h3>{socketID}</h3>
      <form onSubmit={joinRoomHandler}>
        <label>Join Room: </label>
        <input value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        <button>Join</button>
      </form>
      <form onSubmit={handleSubmit}>
        <label>Message: </label>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <label>Room: </label>
        <input value={room} onChange={(e) => setRoom(e.target.value)} />
        <button>Submit</button>
      </form>
      {messages.map((m, i) => (
        <p key={i}>{m}</p>
      ))}
    </div>
  );
}

export default App;
