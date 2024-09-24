const { v4 } = require("uuid");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Secret_Key } = require("../../env");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/e-learning")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Create the User model
const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
        name: { type: String, required: true },
        id: { type: String, required: true },
        gender: {
          type: String,
          enum: ["Male", "Female"],
          required: true,
        },
        email: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
          type: String,
          enum: ["SuperAdmin", "Admin", "Instructor", "Student"],
          required: true,
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true }
  )
);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema(
    {
      title: { type: String, required: true, unique: true },
      desc: { type: String, required: true },
      id: { type: String, required: true, unique: true },
      hours: { type: Number, required: true },
    },
    { timestamps: true }
  )
);

const Student_Course = mongoose.model(
  "Student_Course",
  new mongoose.Schema(
    {
      studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      duration: { type: Number, required: true },
    },
    { timestamps: true }
  )
);

const Instructor_Course = mongoose.model(
  "Instructor_Course",
  new mongoose.Schema(
    {
      instructorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      duration: { type: Number, required: true },
    },
    { timestamps: true }
  )
);

const Session = mongoose.model(
  "Session",
  new mongoose.Schema(
    {
      token: { type: String, required: true },
      createDate: { type: Date, default: Date.now },
    },
    { timestamps: true }
  )
);

const Exam = mongoose.model(
  "Exam",
  new mongoose.Schema(
    {
      id: { type: String, required: true, unique: true },
      courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      title: { type: String, required: true },
      startDate: { type: Date, required: true },
      duration: { type: Number, required: true }, // Duration in minutes
      endDate: { type: Date, required: true },
    },
    { timestamps: true }
  )
);

const Question = mongoose.model(
  "Question",
  new mongoose.Schema(
    {
      id: { type: String, required: true, unique: true },
      title: { type: String, required: true },
      answers: { type: [String], required: true },
      correctAnswer: { type: String, required: true },
      examID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
      },
    },
    { timestamps: true }
  )
);

const Assignment = mongoose.model(
  "Assignment",
  new mongoose.Schema(
    {
      id: { type: String, required: true, unique: true },
      courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      startDate: { type: Date, required: true },
      duration: { type: Number, required: true }, // Duration in hours
      endDate: { type: Date, required: true },
      title: { type: String, required: true },
      document: { type: String, required: true },
    },
    { timestamps: true }
  )
);

const AssignmentAnswer = mongoose.model(
  "AssignmentAnswer",
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    document: { type: String, required: true },
    assignmentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    grade: { type: Number },
  })
);

const StudentExam = mongoose.model(
  "StudentExam",
  new mongoose.Schema(
    {
      examID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
      },
      studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      grade: { type: Number },
    },
    { timestamps: true }
  )
);
//--------------------------------------------

module.exports = {
  User,
  Course,
  Student_Course,
  Instructor_Course,
  Session,
  Exam,
  Assignment,
  StudentExam,
  AssignmentAnswer,
  Question,
};
