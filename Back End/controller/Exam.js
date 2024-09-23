const { Exam, StudentExam, Question, Course } = require("../db/Database");
const { v4: uuidv4 } = require("uuid");
/*
    Functions to be implemented:
    - createExam  DONE
    - addQuestions DONE
    - getExams 
    - getExam
    - updateExam
    - SolveExam
    - getStudentExams
*/
async function findCOurseIdByTitle(title) {
  return Course.findOne({ title: title }).then((course) => {
    if (!course) return null;
    return course._id;
  });
}

async function findExamIdByTitle(title) {
  return Exam.findOne({ title: title }).then((exam) => {
    if (!exam) return null;
    return exam._id;
  });
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

module.exports.addQuestions = async (req, res, next) => {
  try {
    const { examTitle, questions } = req.body;
    const examID = await findExamIdByTitle(examTitle);
    if (examID === null) {
      return res.status(200).json({ error: "Exam not found" });
    }

    if (!questions || questions.length === 0) {
      return res
        .status(200)
        .json({ error: "Exam must at least has one question" });
    }

    for (const questionData of questions) {
      const { title, answers, correctAnswer } = questionData;
      if (!title || !answers || !correctAnswer) {
        return res.status(200).json({
          error:
            "Please ensure that the title and asnwers and the coreect answer are assigned",
        });
      }
      const question = new Question({
        id: uuidv4(),
        title,
        answers,
        correctAnswer,
        examID,
      });
      await question.save();
    }

    res.status(201).json({ message: "Questions were added successfully" });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: addQuestions function => ${error}`);
  }
};

module.exports.getExam = async (req, res, next) => {};
