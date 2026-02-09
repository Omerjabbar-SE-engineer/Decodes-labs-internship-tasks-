import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [roomId, setRoomId] = useState("");
  const [activeRooms, setActiveRooms] = useState([]);
  const cardsRef = useRef([]);

  // Intersection Observer for scroll animation
  useEffect(() => {
    if (!cardsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, idx * 150); // staggered animation
          }
        });
      },
      { threshold: 0.3 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const handleCreateRoom = () => {
    const roomId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 10);
    navigate(`/room/${roomId}`);
  };

  const handleJoinRoom = () => {
    if (!roomId) return alert("Enter Room ID to join");
    navigate(`/room/${roomId}`);
  };

  const featureCards = [
    {
      title: "High-Quality Video",
      desc: "Crystal-clear video calls for seamless communication with your team or friends."
    },
    {
      title: "Real-Time Chat",
      desc: "Instant messaging and collaboration without any delays."
    },
    {
      title: "Screen Sharing",
      desc: "Share your screen to present, teach, or collaborate effectively."
    },
    {
      title: "File Sharing",
      desc: "Securely upload and share files in real-time."
    },
    {
      title: "Interactive Whiteboard",
      desc: "Draw, brainstorm, and collaborate together."
    },
    {
      title: "Secure Authentication",
      desc: "Encrypted communication to keep your data safe."
    }
  ];

  const extraCards = [
    {
      title: "Fast and Reliable",
      desc: "Low latency and optimized for smooth meetings."
    },
    {
      title: "User-Friendly Interface",
      desc: "Intuitive and easy for anyone to use."
    },
    {
      title: "Cross-Platform",
      desc: "Works on Windows, Mac, iOS, Android, and browsers."
    },
    {
      title: "Community Support",
      desc: "Active community to help, share, and guide."
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="header-section">
        <h1>Welcome TO MeetHive , {username}!</h1>
        <p>Choose an action and explore our amazing features</p>
      </div>

      {/* Room Section */}
      <div className="room-section">
        <button className="btn" onClick={handleCreateRoom}>
          Create New Room
        </button>
        <div className="join-room">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      </div>

      {/* Active Rooms */}
      {activeRooms.length > 0 && (
        <div className="active-rooms">
          <h3>Active Rooms:</h3>
          <ul>
            {activeRooms.map((room) => (
              <li key={room.roomId}>
                {room.roomId} - Hosted by {room.hostId}
                <button
                  className="small-btn"
                  onClick={() => navigate(`/room/${room.roomId}`)}
                >
                  Join
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Feature Cards */}
      <section className="features">
        <h2>Why Choose Us</h2>
        <div className="cards">
          {featureCards.map((card, idx) => (
            <div
              key={idx}
              className="card"
              ref={(el) => (cardsRef.current[idx] = el)}
            >
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Extra Cards */}
      <section className="extra-info">
        <h2>More About Our Platform</h2>
        <div className="cards">
          {extraCards.map((card, idx) => (
            <div
              key={idx}
              className="card"
              ref={(el) => (cardsRef.current[featureCards.length + idx] = el)}
            >
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Logout Button */}
      <button className="btn logout-btn" onClick={() => navigate("/")}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
