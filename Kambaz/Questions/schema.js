import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel", required: true },
    type: { 
      type: String, 
      enum: ["multiple-choice", "true-false", "fill-in-blank"],
      required: true 
    },
    title: { type: String, required: true },
    points: { type: Number, default: 1 },
    question: { type: String, required: true },
    
    choices: [{
      text: String,
      isCorrect: Boolean
    }],
    
    correctAnswer: Boolean,
    
    possibleAnswers: [String],
  },
  { 
    collection: "questions",
    strict: false
  }
);

export default questionSchema;