import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesDao(db) {
  
  async function findQuizzesForCourse(courseId) {
    return await model.find({ course: courseId });
  }

  async function findQuizById(quizId) {
    return await model.findById(quizId);
  }

  async function createQuiz(quiz) {
    const newQuiz = { 
      ...quiz, 
      _id: uuidv4(),
      title: quiz.title || "Unnamed Quiz",
      points: 0,
      published: false
    };
    return await model.create(newQuiz);
  }

  async function updateQuiz(quizId, quizUpdates) {
    return await model.updateOne(
      { _id: quizId },
      { $set: quizUpdates }
    );
  }

  async function deleteQuiz(quizId) {
    return await model.deleteOne({ _id: quizId });
  }

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
  };
}