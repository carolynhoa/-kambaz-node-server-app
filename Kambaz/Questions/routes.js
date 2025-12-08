import QuestionsDao from "./dao.js";
import mongoose from "mongoose"; 
import model from "./model.js";  

export default function QuestionsRoutes(app, db) {
  const dao = QuestionsDao(db);

  const findQuestionsForQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const questions = await dao.findQuestionsForQuiz(quizId);
      res.json(questions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Unable to load questions" });
    }
  };

  const findQuestionById = async (req, res) => {
    try {
      const { questionId } = req.params;
      const question = await dao.findQuestionById(questionId);
      res.json(question);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Unable to load question" });
    }
  };

  const createQuestion = async (req, res) => {
    try {
      const { quizId } = req.params;
      const question = await dao.createQuestion({
        quiz: quizId,
        ...req.body,
      });
      res.json(question);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Unable to create question" });
    }
  };

  const updateQuestion = async (req, res) => {
    try {
      const { questionId } = req.params;
      const result = await dao.updateQuestion(questionId, req.body);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Unable to update question" });
    }
  };

  const deleteQuestion = async (req, res) => {
    try {
      const { questionId } = req.params;
      const result = await dao.deleteQuestion(questionId);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Unable to delete question" });
    }
  };

app.get("/api/questions/:questionId/raw", async (req, res) => {
    try {
      const { questionId } = req.params;
      
      const result = await model.findById(questionId).lean();
      
      res.json({
        questionId: questionId,
        found: result,
        exists: result !== null,
        idMatch: result?._id === questionId,
        idFromDB: result?._id,
        idFromParam: questionId,
        idLengthDB: result?._id?.length,
        idLengthParam: questionId.length
      });
    } catch (err) {
      res.json({ error: err.message });
    }
  });

  app.get("/api/quizzes/:quizId/questions", findQuestionsForQuiz);
  app.get("/api/questions/:questionId", findQuestionById);
  app.post("/api/quizzes/:quizId/questions", createQuestion);
  app.put("/api/questions/:questionId", updateQuestion);
  app.delete("/api/questions/:questionId", deleteQuestion);
}
