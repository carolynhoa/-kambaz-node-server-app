import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: { type: String, ref: "QuizModel", required: true },
    student: { type: String, ref: "UserModel", required: true },
    answers: { type: Object, default: {} }, 
    score: { type: Number, default: 0 },
  },
  { collection: "quiz_attempts", timestamps: { createdAt: true, updatedAt: true } }
);

const model = mongoose.model("QuizAttemptModel", quizAttemptSchema);
export default model;
