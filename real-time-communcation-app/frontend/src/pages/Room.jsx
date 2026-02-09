import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import "../css/room.css";

const SOCKET_SERVER_URL = "http://localhost:5000";

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef();
  const socketRef = useRef();
  const localStreamRef = useRef();

  // ---------------- UI States ----------------
  const [showChat, setShowChat] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [files, setFiles] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  // ---------------- Whiteboard ----------------
  const canvasRef = useRef();
  const ctxRef = useRef();
  const drawing = useRef(false);

  // ---------------- Connect video & socket ----------------
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.emit("join-room", {
      roomId,
      userId: socketRef.current.id,
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        localStreamRef.current = stream;
      });

    socketRef.current.on("drawing", (data) => {
      if (ctxRef.current) drawFromData(data);
    });

    socketRef.current.on("file-shared", (file) => {
      setFiles(prev => [...prev, file]);
    });

    socketRef.current.on("chat-message", (message) => {
      setChatHistory(prev => [...prev, message]);
    });

    return () => socketRef.current.disconnect();
  }, [roomId]);

  // ---------------- Whiteboard initialization ----------------
  useEffect(() => {
    if (!showWhiteboard) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctxRef.current = ctx;
  }, [showWhiteboard]);

  // ---------------- Whiteboard drawing ----------------
  const getPosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e) => {
    drawing.current = true;
    const { x, y } = getPosition(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const stopDrawing = () => {
    drawing.current = false;
    ctxRef.current.beginPath();
  };

  const draw = (e) => {
    if (!drawing.current) return;
    const { x, y } = getPosition(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    socketRef.current.emit("drawing", { roomId, x, y });
  };

  const drawFromData = ({ x, y }) => {
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  // ---------------- File upload ----------------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${SOCKET_SERVER_URL}/api/upload`, formData);
    setFiles(prev => [...prev, response.data]);
    socketRef.current.emit("file-shared", response.data);
  };

  // ---------------- Screen Sharing ----------------
  const handleScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const videoTrack = screenStream.getVideoTracks()[0];
      localVideoRef.current.srcObject = screenStream;
      videoTrack.onended = () => { localVideoRef.current.srcObject = localStreamRef.current; };
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  // ---------------- Toggle Camera & Mic ----------------
  const toggleCamera = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !cameraOn);
    setCameraOn(!cameraOn);
  };

  const toggleMic = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !micOn);
    setMicOn(!micOn);
  };

  // ---------------- Chat ----------------
  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    const messageData = { user: "You", text: chatMessage };
    setChatHistory(prev => [...prev, messageData]);
    socketRef.current.emit("chat-message", {
      roomId,
      message: { user: "Someone", text: chatMessage },
    });
    setChatMessage("");
  };

  // ---------------- Render ----------------
  return (
    <div className="room-container">
      <h1 className="room-title">Room: {roomId}</h1>

      {/* Video */}
      <video ref={localVideoRef} autoPlay muted className="local-video" />

      {/* Controls */}
      <div className="controls">
        <button onClick={toggleCamera} className="control-btn">{cameraOn ? "Camera On" : "Camera Off"}</button>
        <button onClick={toggleMic} className="control-btn">{micOn ? "Mic On" : "Mic Off"}</button>
        <button onClick={() => setShowWhiteboard(!showWhiteboard)} className="control-btn">{showWhiteboard ? "Close Whiteboard" : "Open Whiteboard"}</button>
        <button onClick={() => setShowChat(!showChat)} className="control-btn">{showChat ? "Close Chat" : "Open Chat"}</button>
        <button onClick={handleScreenShare} className="control-btn">Share Screen</button>
      </div>

      {/* Whiteboard */}
      {showWhiteboard && (
        <canvas
          ref={canvasRef}
          className="whiteboard"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
      )}

   <div className="file-section">
  <h3 className="file-heading">Files Shared</h3>

  {/* Styled Upload Button */}
  <label className="file-upload-btn">
    Upload File
    <input type="file" onChange={handleFileUpload} />
  </label>

  <ul className="file-list">
    {files.map((file, idx) => (
      <li key={idx}>
        <a href={file.url} target="_blank" rel="noreferrer">{file.originalname}</a>
      </li>
    ))}
  </ul>
</div>


      {/* Chat Panel */}
      {showChat && (
        <div className="chat-panel">
          <h3>Chat</h3>
          <div className="chat-box">
            {chatHistory.map((msg, idx) => (
              <p key={idx}><strong>{msg.user}:</strong> {msg.text}</p>
            ))}
          </div>
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendChatMessage}>Send</button>
        </div>
      )}

      {/* Leave Room */}
      <button className="leave-btn" onClick={() => navigate("/dashboard")}>Leave Room</button>
    </div>
  );
}

export default Room;

