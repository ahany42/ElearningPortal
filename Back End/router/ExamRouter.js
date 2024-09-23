const { Router } = require("express");
const Controller = require("../controller/Exam");
const { VerifyTokenForInstructor } = require("../controller/VerifyToken");
const router = Router();

/*
 * URLS to be implemented:
 */

router.post("/createExam", VerifyTokenForInstructor, Controller.createExam); //verified
router.post("/addQuestions", VerifyTokenForInstructor, Controller.addQuestions); //verified

module.exports = router;
