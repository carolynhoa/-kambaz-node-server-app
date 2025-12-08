import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuestionsDao(db) {
  
  const findQuestionsForQuiz = async (quizId) => {
    console.log("DAO: Finding questions for quiz:", quizId);
    const result = await model.find({ quiz: quizId });
    console.log("DAO: Found questions:", result.length);
    return result;
  };

  const findQuestionById = async (questionId) => {
    return await model.findById(questionId);
  };

  const createQuestion = async (question) => {
    const toCreate = {
      _id: uuidv4(),
      ...question,
    };
    console.log("DAO: Creating question:", toCreate);
    const created = await model.create(toCreate);
    console.log("DAO: Created question:", created);
    return created;
  };

  const updateQuestion = async (questionId, updates) => {
    console.log("DAO: Updating question", questionId, "with:", updates);
    const result = await model.updateOne({ _id: questionId }, { $set: updates });
    console.log("DAO: Update result:", result);
    return result;
  };

  const deleteQuestion = async (questionId) => {
    console.log("DAO: Deleting question:", questionId);
    return await model.deleteOne({ _id: questionId });
  };

  return {
    findQuestionsForQuiz,
    findQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };
}