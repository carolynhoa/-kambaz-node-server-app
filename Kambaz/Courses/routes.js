import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {  
  const dao = CoursesDao(db);                     
  const enrollmentsDao = EnrollmentsDao(db);      

  const findAllCourses = async (req, res) => {
    try {
      const courses = await dao.findAllCourses();
      res.json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to retrieve courses" });
    }
  };

  const findCoursesForEnrolledUser = async (req, res) => {
    try {
      let { userId } = req.params;
      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          return res.sendStatus(401);
        }
        userId = currentUser._id;
      }
      const courses = await enrollmentsDao.findCoursesForUser(userId);
      res.json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to retrieve enrolled courses" });
    }
  };

  const createCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);

      const newCourse = await dao.createCourse(req.body);

      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);

      res.json(newCourse);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create course" });
    }
  };

  const updateCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const courseUpdates = req.body;
      const status = await dao.updateCourse(courseId, courseUpdates);
      res.send(status);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update course" });
    }
  };

  const deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
      const status = await dao.deleteCourse(courseId);
      res.send(status);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete course" });
    }
  };

  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };
  
  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  }
  app.get("/api/courses/:cid/users", findUsersForCourse);
  
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
  

  app.get("/api/courses", findAllCourses);
  app.post("/api/users/current/courses", createCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
}