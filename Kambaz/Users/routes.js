import UsersDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

const signin = async (req, res) => {
  const { username, password } = req.body;
  console.log("=== SIGNIN START ===");
  console.log("1. Username:", username);
  console.log("2. Session ID before:", req.sessionID);
  console.log("3. Session before:", JSON.stringify(req.session));
  
  const currentUser = await dao.findUserByCredentials(username, password);
  
  if (currentUser) {
    console.log("4. User found:", currentUser.username);
    req.session["currentUser"] = currentUser;
    console.log("5. Session after setting user:", JSON.stringify(req.session));
    
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.log("6. ERROR saving session:", err);
          reject(err);
        } else {
          console.log("6. Session saved successfully");
          console.log("7. Session after save:", JSON.stringify(req.session));
          resolve();
        }
      });
    });
    
    res.json(currentUser);
  } else {
    console.log("4. Invalid credentials");
    res.status(401).json({ message: "Unable to login. Try again later." });
  }
  console.log("SIGNIN END");
};
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    res.json(currentUser);
  };

  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
    res.json(currentUser);
  };

  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  const enrollInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);
      uid = currentUser._id;
    }
    try {
      await enrollmentsDao.enrollUserInCourse(uid, cid);
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error enrolling in course" });
    }
  };

  const unenrollFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);
      uid = currentUser._id;
    }
    try {
      await enrollmentsDao.unenrollUserFromCourse(uid, cid);
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error unenrolling from course" });
    }
  };

  app.post("/api/users/signin", signin);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);

  app.post("/api/users/:uid/courses/:cid", enrollInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollFromCourse);
}