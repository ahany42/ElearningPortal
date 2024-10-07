const { Router } = require("express");
const Controller = require("../controller/Exam");
const verifyToken = require("../controller/VerifyToken");
const router = Router();

/*
 * URLS to be implemented:
 */

router.post("/createExam", verifyToken("Instructor"), Controller.createExam); //verified
router.post("/addQuestions", verifyToken("Instructor"), Controller.addQuestions); //verified

module.exports = router;
