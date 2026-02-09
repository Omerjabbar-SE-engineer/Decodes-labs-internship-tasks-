import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  
  // For now, hardcoded username. Later replace with actual logged-in user
  const username = "User";

  return (
    <div style={styles.container}>
      <h1>Welcome, {username}!</h1>
      <p>This is your Dashboard</p>

      <div style={styles.buttons}>
        <button style={styles.btn} onClick={() => alert("Video Call feature coming soon!")}>
          Video Call
        </button>
        <button style={styles.btn} onClick={() => alert("Whiteboard feature coming soon!")}>
          Whiteboard
        </button>
        <button style={styles.btn} onClick={() => alert("File Sharing feature coming soon!")}>
          File Sharing
        </button>
      </div>

      <button
        style={{ ...styles.btn, marginTop: "30px", backgroundColor: "#f44336", color: "#fff" }}
        onClick={() => navigate("/")}
      >
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    fontFamily: "Arial"
  },
  buttons: {
    display: "flex",
    gap: "15px"
  },
  btn: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default Dashboard;
