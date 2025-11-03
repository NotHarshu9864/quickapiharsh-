import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(express.json());

// ✅ Allow only your Netlify domain
app.use(
  cors({
    origin: "https://quickmobileapi.netlify.app/auth",
  })
);

// In-memory storage (you can replace later with database)
let validKeys = {};

// 🕒 Generate 48-hour expiry (milliseconds)
const EXPIRY_TIME = 48 * 60 * 60 * 1000;

// 🧠 Generate new key when user visits homepage
app.get("/", (req, res) => {
  const newKey = crypto.randomBytes(16).toString("hex");
  const expiresAt = Date.now() + EXPIRY_TIME;

  // Store key
  validKeys[newKey] = { expiresAt };

  // HTML response (you can use your existing design here)
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Your Auth Key - QuickToppers</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background: #f5f7ff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #2b2d42;
      padding: 20px;
    }
    .container {
      background: #fff;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      text-align: center;
      max-width: 500px;
      width: 100%;
    }
    h1 { font-size: 22px; margin-bottom: 20px; }
    input {
      width: 100%;
      padding: 14px;
      font-size: 18px;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      background: #f8f9fa;
      text-align: center;
      font-family: monospace;
      font-weight: 600;
    }
    button {
      margin-top: 20px;
      background: #4361ee;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 16px;
import express from "express";
import cors from "cors";
import crypto from "crypto";
import fs from "fs";

const app = express();
app.use(express.json());

// ✅ Allow only your frontend domain
app.use(
  cors({
    origin: "https://quickmobileapi.netlify.app",
  })
);

// 🔒 File to store keys persistently
const KEYS_FILE = "./keys.json";

// Load keys from file or initialize empty object
let validKeys = {};
if (fs.existsSync(KEYS_FILE)) {
  validKeys = JSON.parse(fs.readFileSync(KEYS_FILE));
}

// Save keys to file safely
function saveKeys() {
  fs.writeFileSync(KEYS_FILE, JSON.stringify(validKeys, null, 2));
}

// 48-hour expiry
const EXPIRY_TIME = 48 * 60 * 60 * 1000;

// 🧠 Generate a new key (main route)
app.get("/", (req, res) => {
  const newKey = crypto.randomBytes(16).toString("hex");
  const expiresAt = Date.now() + EXPIRY_TIME;

  validKeys[newKey] = { expiresAt };
  saveKeys();

  // HTML response
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Your Auth Key - QuickToppers</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background: #f5f7ff; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; color: #2b2d42; }
    .box { background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); text-align: center; max-width: 400px; }
    input { width: 100%; padding: 12px; font-size: 16px; border: 2px solid #e9ecef; border-radius: 10px; margin: 10px 0; font-family: monospace; text-align: center; }
    button { background: #4361ee; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-size: 16px; }
    button:hover { background: #3a56d4; }
    .meta { font-size: 13px; color: #6c757d; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="box">
    <h2>Your Auth Key</h2>
    <input type="text" value="${newKey}" readonly />
    <button onclick="navigator.clipboard.writeText('${newKey}')">Copy Key</button>
    <div class="meta">Valid for 48 hours • Device-bound</div>
  </div>
</body>
</html>
  `);
});

// ✅ Verify key API endpoint
app.post("/verify-key", (req, res) => {
  const { key } = req.body;

  if (!key || !validKeys[key]) {
    return res.json({ valid: false, message: "Invalid key" });
  }

  const { expiresAt } = validKeys[key];

  if (Date.now() > expiresAt) {
    delete validKeys[key];
    saveKeys();
    return res.json({ valid: false, message: "Key expired" });
  }

  res.json({ valid: true, message: "Key valid" });
});

// 🧹 Optional cleanup (removes old keys automatically)
setInterval(() => {
  let changed = false;
  for (const [key, data] of Object.entries(validKeys)) {
    if (Date.now() > data.expiresAt) {
      delete validKeys[key];
      changed = true;
    }
  }
  if (changed) saveKeys();
}, 60 * 60 * 1000); // every hour

// 🩺 Health check
app.get("/health", (req, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
