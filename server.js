const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt"); // ✅ FIXED

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECTION =================
const MONGO_URI = "mongodb+srv://annapureddybharathi18_db_user:B1h2a3r4a5t6h7i8@cluster0.gunt8s0.mongodb.net/outpro";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error:", err));

// ================= MODELS =================

// 🔐 User Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// 📩 Contact Model
const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  company: String,
  service: String,
  message: String,
  budget: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model("Contact", contactSchema);

// ================= ROUTES =================

// 🧪 Test Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 🔐 LOGIN API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials ❌" });
    }

    res.json({ message: "Login successful ✅" });

  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📩 CONTACT API
app.post("/contact", async (req, res) => {
  console.log("📩 Incoming data:", req.body);

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      service,
      message,
      budget
    } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({ message: "Name and email are required ⚠️" });
    }

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      company,
      service,
      message,
      budget
    });

    await newContact.save();

    res.json({ message: "Enquiry saved successfully 🚀" });

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 👤 CREATE DEFAULT USER
app.get("/create-user", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("1234", 10);

    const user = new User({
      email: "admin@gmail.com",
      password: hashedPassword
    });

    await user.save();

    res.send("User created ✅");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
