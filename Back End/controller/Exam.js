const { Exam, StudentExam, Question, Course } = require("../db/Database");

const { v4: uuidv4 } = require("uuid");
/*
    Functions to be implemented:
    - createExam  DONE
    - addQuestions
    - getExams
    - getExam
    - updateExam
    - SolveExam
    - getStudentExams
*/
function findCOurseIdByTitle(title) {
  return Course.findOne({ title: title }).then((course) => course._id);
}
module.exports.createExam = async (req, res, next) => {
  try {
    const { title, courseTitle, sDate, duration, eDate } = req.body;

    if (!title || !courseTitle || !sDate || !duration || !eDate) {
      return res.status(200).json({ error: "All fields are required" });
    }
    const startDate = new Date(sDate);
    const endDate = new Date(eDate);
    if (endDate < startDate) {
      return res
        .status(200)
        .json({ error: "End date must be greater than start date" });
    }
    if (endDate < new Date()) {
      return res.status(200).json({ error: "End date must be in the future" });
    }
    const courseId = await findCOurseIdByTitle(courseTitle);
    const exam = new Exam({
      id: uuidv4(),
      courseID: courseId,
      title,
      startDate,
      duration,
      endDate,
    });
    await exam.save();
    res.status(201).json({ message: "Exam created successfully" });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: createExam function => ${error}`);
  }
};
