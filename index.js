import "dotenv/config";
import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import session from "express-session";
import MongoStore from "connect-mongo";  
import Hello from "./hello.js";
import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING;
mongoose.connect(CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();

if (process.env.SERVER_ENV === "production") { 
  app.set("trust proxy", 1);
}

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
console.log("Environment:", process.env.SERVER_ENV);
console.log("Allowed origin:", clientUrl);

app.use(cors({
  origin: clientUrl, 
  credentials: true, 
}));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: CONNECTION_STRING,
    collectionName: "sessions"
  }),
  cookie: {
    httpOnly: true,
    secure: false,      
    sameSite: 'lax',   
    maxAge: 24 * 60 * 60 * 1000  
  }
};

if (process.env.SERVER_ENV === "production") { 
  sessionOptions.cookie.secure = true;      
  sessionOptions.cookie.sameSite = "none"; 
  console.log("Using production session config");
}

console.log("Session store configured:", sessionOptions.store ? "MongoDB" : "Memory");

app.use(session(sessionOptions));
app.use(express.json());

app.get("/test-session", (req, res) => {
  console.log("Test - SessionID:", req.sessionID);
  console.log("Test - CurrentUser:", req.session["currentUser"]);
  res.json({ 
    sessionID: req.sessionID,
    currentUser: req.session["currentUser"],
    env: process.env.SERVER_ENV
  });
});

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentRoutes(app, db);
Lab5(app);
Hello(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server is running on port", PORT));