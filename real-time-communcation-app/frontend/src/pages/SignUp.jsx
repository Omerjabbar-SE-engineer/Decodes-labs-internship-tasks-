import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Home.css"; // Use the same CSS for consistent style

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+92");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password,
        phone: countryCode + phone
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
    { title: "Easy Registration", text: "Sign up quickly using your email and phone number." },
    { title: "Secure Login", text: "Your data is encrypted and securely stored." },
    { title: "Instant Verification", text: "Get verified instantly and start communicating." },
    { title: "Multi-Platform", text: "Access your account on desktop or mobile seamlessly." },
    { title: "Profile Setup", text: "Customize your profile with avatar, status, and bio." },
    { title: "Notifications", text: "Receive instant alerts for messages and calls." },
    { title: "Cloud Backup", text: "Your data is automatically synced and backed up securely." },
    { title: "24/7 Support", text: "Get help whenever you need it through support channels." }
  ];

  return (
    <div className="home-container">
      {/* Top cards */}
      <div className="top-cards">
        {/* Left info card */}
        <div className="left-card">
          <h2>Join Our Community</h2>
          <p>Sign up and start connecting with friends, family, or colleagues instantly. Safe, reliable, and fast.</p>
        </div>

        {/* Right signup form card */}
        <div className="home-card">
          <h1 className="home-title">Register</h1>
          <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: "10px", fontSize: "14px", borderRadius: "6px", border: "1px solid #3B82F6" }}
            />
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
            <div style={{ display: "flex", gap: "5px" }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #3B82F6" }}
              >
                <option value="+92">Pakistan (+92)</option>
                <option value="+91">India (+91)</option>
                <option value="+1">USA (+1)</option>
                <option value="+44">UK (+44)</option>
                <option value="+61">Australia (+61)</option>
              </select>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ padding: "10px", flex: 1, borderRadius: "6px", border: "1px solid #3B82F6" }}
              />
            </div>
            <button type="submit" className="vibe-btn">Register</button>
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

export default SignUp;
