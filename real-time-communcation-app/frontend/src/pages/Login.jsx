import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Home.css"; // Use same CSS for consistent style

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password
      });

      // Save token and username
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.name);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // Scroll animation for feature cards
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
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Feature cards array
  const features = [
    { title: "Secure Login", text: "Your credentials are encrypted and securely stored." },
    { title: "Quick Access", text: "Login instantly and continue your conversations." },
    { title: "Multi-Device Support", text: "Access your account from desktop or mobile devices." },
    { title: "Forgot Password", text: "Easily reset your password if you forget it." },
    { title: "Notifications", text: "Stay updated with real-time alerts for messages and calls." },
    { title: "Account Management", text: "Manage your profile, settings, and preferences easily." },
    { title: "24/7 Support", text: "Get help whenever you need it through support channels." }
  ];

  return (
    <div className="home-container">
      {/* Top cards */}
      <div className="top-cards">
        {/* Left info card */}
        <div className="left-card">
          <h2>Welcome Back!</h2>
          <p>Login to your account to continue connecting with friends, colleagues, or family in real-time.</p>
        </div>

        {/* Right login form card */}
        <div className="home-card">
          <h1 className="home-title">Login</h1>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "10px", fontSize: "14px", borderRadius: "6px", border: "1px solid #3B82F6" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "10px", fontSize: "14px", borderRadius: "6px", border: "1px solid #3B82F6" }}
            />
            <button type="submit" className="vibe-btn">Login</button>
          </form>
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

export default Login;
