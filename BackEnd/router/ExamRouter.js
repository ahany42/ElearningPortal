const { Router } = require("express");
const Controller = require("../controller/Exam");
const verifyToken = require("../controller/VerifyToken");
const router = Router();

router.post("/createExam", verifyToken("Instructor"), Controller.createExam); //verified

router.post(
  "/addQuestions",
  verifyToken("Instructor"),
  Controller.addQuestions
); //verified

router.get(
  "/getExamsForAdmins",
  verifyToken("Admin"),
  Controller.getExamsforAdmins
); //verified

router.get(
  "/getExamsForStudents/:studentId",
  verifyToken("Student"),
  Controller.getExamsforStudents
); //verified

router.post("/getExam/:examId", verifyToken(), Controller.getExamQuestions); //verified

router.put(
  "/updateExam/:examId",
  verifyToken("Instructor"),
  Controller.updateExam
); //verified

router.delete(
  "/deleteExam/:examId",
  verifyToken("Instructor"),
  Controller.deleteExam
); //verified

router.put(
  "/updateQuestion/:questionId",
  verifyToken("Instructor"),
  Controller.updateQuestion
); //verified

router.delete(
  "/deleteQuestion/:questionId",
  verifyToken("Instructor"),
  Controller.deleteQuestion
); //verified

router.post(
  "/solveExam/:examId",
  verifyToken("Student"),
  Controller.finishSolvingExam
); //verified

module.exports = router;
