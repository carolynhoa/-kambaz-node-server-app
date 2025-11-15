import express from 'express';
import cors from 'cors';
import session from "express-session";
import "dotenv/config";
import Hello from "./hello.js";
import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";

const app = express();

// 1. CORS first
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL || "http://localhost:3000",
}));

// 2. Session configuration
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,      // false for localhost (no HTTPS)
    sameSite: 'lax',    // 'lax' for localhost
    maxAge: 24 * 60 * 60 * 1000  // 24 hours
  }
};

if (process.env.SERVER_ENV === "production") {  // ← Changed to === "production"
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    domain: process.env.SERVER_URL,
  };
}

app.use(session(sessionOptions));

// 3. JSON parser
app.use(express.json());

// 4. Routes
UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentRoutes(app, db);
Lab5(app);
Hello(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server is running on port", PORT));