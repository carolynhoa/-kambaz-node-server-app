import QuizzesDao from "./dao.js";

export default function QuizRoutes(app, db) {
  const dao = QuizzesDao(db);

  const findQuizzesForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const quizzes = await dao.findQuizzesForCourse(courseId);
      res.json(quizzes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to find quizzes" });
    }
  };

  const findQuizById = async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await dao.findQuizById(quizId);
      res.json(quiz);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to find quiz" });
    }
  };

  const createQuiz = async (req, res) => {
    try {
      const { courseId } = req.params;
      const quiz = {
        ...req.body,
        course: courseId,
      };
      const newQuiz = await dao.createQuiz(quiz);
      res.json(newQuiz);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create quiz" });
    }
  };

  const updateQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const status = await dao.updateQuiz(quizId, req.body);
      res.json(status);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update quiz" });
    }
  };

  const deleteQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const status = await dao.deleteQuiz(quizId);
      res.json(status);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete quiz" });
    }
  };

  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
}