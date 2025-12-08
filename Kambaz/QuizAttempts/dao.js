import model from "./model.js";

export default function QuizAttemptsDao(db) {
  const QuizAttemptModel = model;

  const createAttempt = async (attempt) => {
    return await QuizAttemptModel.create(attempt);
  };

  const findAttemptsForStudent = async (quizId, studentId) => {
    return await QuizAttemptModel
      .find({ quiz: quizId, student: studentId })
      .sort({ createdAt: 1 });
  };

  const findAttemptsForQuiz = async (quizId) => {
    return await QuizAttemptModel.find({ quiz: quizId });
  };

  return {
    createAttempt,
    findAttemptsForStudent,
    findAttemptsForQuiz,
  };
}
