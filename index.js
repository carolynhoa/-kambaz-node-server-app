import "dotenv/config";
import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import session from "express-session";
import Hello from "./hello.js";
import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";


const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING;
console.log("Connection string:", CONNECTION_STRING);  

mongoose.connect(CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

app.use(cors({
  origin: clientUrl, 
  credentials: true, 
}));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,      
    sameSite: 'lax',   
    maxAge: 24 * 60 * 60 * 1000  
  }
};


if (process.env.SERVER_ENV === "production") { 
  sessionOptions.proxy = true;  
  sessionOptions.cookie.secure = true;      
  sessionOptions.cookie.sameSite = "none"; 
}


app.use(session(sessionOptions));

app.use(express.json());

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentRoutes(app, db);
Lab5(app);
Hello(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server is running on port", PORT));