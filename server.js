require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from .env");
}

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json({ limit: "20kb" }));

// Temporary storage. Data disappears when the server restarts.
const users = [];
const blogs = [];

function createToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
}

function authenticateToken(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Inkwell API is running" });
});

// Register a user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" || password.length < 8
    ) {
      return res.status(400).json({
        message: "Provide a name, valid email, and password of at least 8 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (users.some(user => user.email === normalizedEmail)) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash
    };

    users.push(user);

    res.status(201).json({
      message: "Registration successful",
      token: createToken(user),
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch {
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login a user
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = users.find(
    item => item.email === email.trim().toLowerCase()
  );

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    message: "Login successful",
    token: createToken(user),
    user: { id: user.id, name: user.name, email: user.email }
  });
});

// Create a blog (login required)
app.post("/api/blogs", authenticateToken, (req, res) => {
  const { title, category, excerpt } = req.body || {};

  if (
    typeof title !== "string" || !title.trim() ||
    typeof category !== "string" || !category.trim() ||
    typeof excerpt !== "string" || !excerpt.trim()
  ) {
    return res.status(400).json({
      message: "Title, category, and introduction are required"
    });
  }

  const user = users.find(item => item.id === req.auth.sub);

  if (!user) {
    return res.status(401).json({ message: "User no longer exists" });
  }

  const blog = {
    id: crypto.randomUUID(),
    title: title.trim(),
    category: category.trim(),
    excerpt: excerpt.trim(),
    author: user.name,
    userId: user.id,
    createdAt: new Date().toISOString()
  };

  blogs.unshift(blog);

  res.status(201).json({ message: "Blog created", blog });
});

// List published blogs
app.get("/api/blogs", (req, res) => {
  res.json({ blogs });
});

app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.listen(PORT, () => {
  console.log(`Inkwell API running at http://localhost:${PORT}`);
});