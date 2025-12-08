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
import QuizRoutes from "./Kambaz/Quizzes/routes.js";
import QuizAttemptsRoutes from "./Kambaz/QuizAttempts/routes.js";
import QuestionsRoutes from "./Kambaz/Questions/routes.js";



const app = express();

if (process.env.SERVER_ENV === "production") { 
  app.set("trust proxy", 1);
}

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
  "https://kambaz-next-js-cs4550-fa25-git-a6-carolyns-projects-1a7d3646.vercel.app",  
];

console.log("Environment:", process.env.SERVER_ENV);
console.log("Allowed origins:", allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.includes("localhost")) return callback(null, true);
    
    if (origin.includes("kambaz-next-js-cs4550-fa25") && origin.includes("vercel.app")) {
      console.log("Allowed Vercel origin:", origin);
      return callback(null, true);
    }
    
    console.log("BLOCKED origin:", origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

await mongoose.connect(CONNECTION_STRING);
console.log("Connected to MongoDB");

const sessionOptions = {
  name: "kambaz.sid", 
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: CONNECTION_STRING,
    touchAfter: 24 * 3600,
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.SERVER_ENV === "production",
    sameSite: process.env.SERVER_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  }
};

console.log("Session config:", {
  secure: sessionOptions.cookie.secure,
  sameSite: sessionOptions.cookie.sameSite,
  store: "MongoDB"
});

app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentRoutes(app, db);
QuizRoutes(app, db); 
QuizAttemptsRoutes(app, db);
QuestionsRoutes(app, db);
Lab5(app);
Hello(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server running on port", PORT));