import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) {
  app.post("/api/enrollments/:userId/:courseId", async (req, res) => {
    try {
      const { userId, courseId } = req.params;
      const enrollment = await enrollmentsDao.enrollUserInCourse(userId, courseId);
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/enrollments/:userId/:courseId", async (req, res) => {
    try {
      const { userId, courseId } = req.params;
      const result = await enrollmentsDao.unenrollUserFromCourse(userId, courseId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/enrollments/user/:userId/courses", async (req, res) => {
    try {
      const { userId } = req.params;
      const courses = await enrollmentsDao.findCoursesForUser(userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/enrollments/course/:courseId/users", async (req, res) => {
    try {
      const { courseId } = req.params;
      const users = await enrollmentsDao.findUsersForCourse(courseId);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}