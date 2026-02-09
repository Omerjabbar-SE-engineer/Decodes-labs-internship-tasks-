// ================== SERVER.JS ==================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/User");
const app = express();

// ----------------- MIDDLEWARE -----------------
app.use(cors());
app.use(express.json());

// ----------------- MONGODB CONNECTION -----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ----------------- ROUTES -----------------
app.get("/", (req, res) => res.send("Backend is running"));

// ----------------- REGISTER -----------------
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phone });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, name: newUser.name }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { name: newUser.name, email: newUser.email, phone: newUser.phone }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- LOGIN -----------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email, phone: user.phone }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== SOCKET.IO ==================
const http = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(http, {
  cors: { origin: "*" } // allow all origins (update for production)
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ----------------- JOIN ROOM -----------------
  socket.on("join-room", ({ roomId, userId }) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.roomId = roomId;
    socket.userId = userId;
  });

  // ----------------- SIGNAL FOR WEBRTC -----------------
  socket.on("signal", (data) => {
    socket.to(data.to).emit("signal", data.signal);
  });

  // ----------------- WHITEBOARD -----------------
  socket.on("drawing", ({ roomId, data }) => {
    socket.to(roomId).emit("drawing", data);
  });

  // ----------------- CHAT -----------------
  socket.on("chat-message", ({ roomId, message }) => {
    socket.to(roomId).emit("chat-message", message);
  });

  // ----------------- FILE SHARING -----------------
  socket.on("file-shared", (data) => {
    socket.to(data.roomId).emit("file-shared", data);
  });

  // ----------------- DISCONNECT -----------------
  socket.on("disconnect", () => {
    if (socket.roomId && socket.userId) {
      socket.to(socket.roomId).emit("user-disconnected", socket.userId);
    }
    console.log("User disconnected:", socket.id);
  });
});

// ================== FILE UPLOAD ==================
const multer = require("multer");
const path = require("path");
const fs = require("fs");

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    res.status(200).json({
      message: "File uploaded successfully",
      filename: file.filename,
      originalname: file.originalname,
      url: `http://localhost:${PORT}/uploads/${file.filename}`
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
