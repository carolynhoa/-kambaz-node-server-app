import QuizAttemptsDao from "./dao.js";

export default function QuizAttemptsRoutes(app, db) {
  const dao = QuizAttemptsDao(db);

  app.post("/api/quiz-attempts/:quizId", async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.sendStatus(401);
      }

      const quizId = req.params.quizId;
      const body = req.body || {};

      const attempt = {
        quiz: quizId,
        student: body.student || currentUser._id,
        answers: body.answers || {},
        score: body.score || 0,
      };

      const saved = await dao.createAttempt(attempt);
      res.json(saved);
    } catch (e) {
      console.error("Error creating quiz attempt:", e);
      res.sendStatus(500);
    }
  });

  app.get("/api/quiz-attempts/:quizId/mine", async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.sendStatus(401);
      }
      const quizId = req.params.quizId;
      const attempts = await dao.findAttemptsForStudent(
        quizId,
        currentUser._id
      );
      res.json(attempts);
    } catch (e) {
      console.error("Error fetching my quiz attempts:", e);
      res.sendStatus(500);
    }
  });

  app.get("/api/quiz-attempts/:quizId", async (req, res) => {
    try {
      const quizId = req.params.quizId;
      const attempts = await dao.findAttemptsForQuiz(quizId);
      res.json(attempts);
    } catch (e) {
      console.error("Error fetching quiz attempts:", e);
      res.sendStatus(500);
    }
  });
}
