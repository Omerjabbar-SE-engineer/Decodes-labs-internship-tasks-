import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../css/Home.css";

function Home() {
  const navigate = useNavigate();

  // Scroll animation
  useEffect(() => {
    const cards = document.querySelectorAll(".feature");
    const onScroll = () => {
      cards.forEach(card => {
        const top = card.getBoundingClientRect().top;
        const bottom = window.innerHeight;
        if (top < bottom - 100) {
          card.classList.add("visible");
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    onScroll(); // initial check
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Multiple feature cards
  const features = [
    { title: "Instant Messaging", text: "Send messages instantly with minimal latency." },
    { title: "Video & Voice Calls", text: "High-quality audio and video calls on any device." },
    { title: "Notifications & Alerts", text: "Stay updated with real-time notifications." },
    { title: "Secure & Private", text: "End-to-end encryption for all communications." },
    { title: "Group Chats", text: "Collaborate in groups easily and securely." },
    { title: "File Sharing", text: "Share files, images, and videos seamlessly." },
    { title: "Multi-Device Support", text: "Use the app on desktop, tablet, or mobile." },
    { title: "Cloud Sync", text: "All your messages are synced securely in the cloud." },
    { title: "Custom Emojis & Reactions", text: "Express yourself with custom emojis and reactions." },
    { title: "Search & History", text: "Find old messages quickly with search functionality." }
  ];

  return (
    <div className="home-container">
      {/* Top cards */}
      <div className="top-cards">
        <div className="left-card">
          <h2>About Our App</h2>
          <p>Connect instantly with friends, family, or colleagues. Safe, reliable, and fast.</p>
        </div>
        <div className="home-card">
          <h1 className="home-title">Real-Time Communication App</h1>
          <div className="home-buttons">
            <button className="vibe-btn" onClick={() => navigate("/login")}>Login</button>
            <button className="vibe-btn" onClick={() => navigate("/signup")}>Register</button>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="features-section">
        {features.map((feature, index) => (
          <div key={index} className="feature fade-in">
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
