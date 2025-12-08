import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: String,
    answer: mongoose.Schema.Types.Mixed
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel", required: true },
    student: { type: String, ref: "UserModel", required: true },
    answers: { type: [answerSchema], default: [] },
    score: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now }
  },
  { collection: "quizAttempts" }
);

export default quizAttemptSchema;
