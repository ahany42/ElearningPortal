const { Exam, StudentExam, Question, Course } = require("../db/Database");
const { v4: uuidv4 } = require("uuid");
/*
    Functions to be implemented:
    - createExam               DONE
    - addQuestions             DONE
    - getExams                 DONE
    - getExam                  DONE
    - updateExam               DONE
    - updateQuestion           DONE
    - deleteExam               DONE
    - deleteQuestion           DONE
    - SolveExam                DONE
    - getStudentExams          DONE
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

module.exports.getExamsforAdmins = async (req, res, next) => {
  try {
    const exams = await Exam.find();
    res.status(201).json({ data: exams });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: getExams function => ${error}`);
  }
};

module.exports.getExamsforStudents = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(200).json({ error: "Student ID is required" });
    }
    const studentExams = await StudentExam.find({ studentID: studentId });
    res.status(201).json({ data: studentExams });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: getExams function => ${error}`);
  }
};

module.exports.getExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    if (!examId) {
      return res.status(200).json({ error: "Exam ID is required" });
    }
    const exam = await Exam.findOne({ id: examId });
    if (!exam) {
      return res.status(200).json({ error: "Exam not found" });
    }
    res.status(201).json({ data: exam });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: getExam function => ${error}`);
  }
};

module.exports.deleteExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    if (!examId) {
      return res.status(200).json({ error: "Exam ID is required" });
    }
    const exam = await Exam.findOne({ id: examId });
    if (!exam) {
      return res.status(200).json({ error: "Exam not found" });
    }
    await Exam.deleteOne({ id: examId });
    res.status(201).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: deleteExam function => ${error}`);
  }
};

module.exports.updateExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    if (!examId) {
      return res.status(200).json({ error: "Exam ID is required" });
    }
    const exam = await Exam.findOne({ id: examId });
    if (!exam) {
      return res.status(200).json({ error: "Exam not found" });
    }
    const { title, startDate, duration, endDate } = req.body;
    if (!title || !startDate || !duration || !endDate) {
      return res.status(200).json({ error: "All fields are required" });
    }
    if (exam.title != title) {
      exam.title = title;
    }
    if (exam.startDate != startDate) {
      exam.startDate = startDate;
    }
    if (exam.duration != duration) {
      exam.duration = duration;
    }
    if (exam.endDate != endDate) {
      exam.endDate = endDate;
    }
    await exam.save();
    res.status(201).json({ message: "Exam updated successfully", exam });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: updateExam function => ${error}`);
  }
};

module.exports.updateQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    if (!questionId) {
      return res.status(200).json({ error: "Question ID is required" });
    }
    const question = await Question.findOne({ id: questionId });
    if (!question) {
      return res.status(200).json({ error: "Question not found" });
    }
    const { title, answers, correctAnswer } = req.body;
    if (!title || !answers || !correctAnswer) {
      return res.status(200).json({ error: "All fields are required" });
    }
    if (question.title != title) {
      question.title = title;
    }
    if (question.answers != answers) {
      question.answers = answers;
    }
    if (question.correctAnswer != correctAnswer) {
      question.correctAnswer = correctAnswer;
    }
    await question.save();
    res
      .status(201)
      .json({ message: "Question updated successfully", question });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: updateQuestion function => ${error}`);
  }
};

module.exports.deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    if (!questionId) {
      return res.status(200).json({ error: "Question ID is required" });
    }
    const question = await Question.findOne({ id: questionId });
    if (!question) {
      return res.status(200).json({ error: "Question not found" });
    }
    await Question.deleteOne({ id: questionId });
    res.status(201).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: deleteQuestion function => ${error}`);
  }
};

module.exports.solveExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    if (!examId) {
      return res.status(200).json({ error: "Exam ID is required" });
    }
    const exam = await Exam.findOne({ id: examId });
    if (!exam) {
      return res.status(200).json({ error: "Exam not found" });
    }
    const { studentId, grade, submissionDate } = req.body;
    if (!studentId || !grade || !submissionDate) {
      return res.status(200).json({ error: "All fields are required" });
    }
    const student = await User.findOne({ id: studentId });
    if (!student) {
      return res.status(200).json({ error: "Student not found" });
    }
    const studentExam = await Student_Exam.findOne({
      examID: examId,
      studentID: studentId,
    });
    if (!studentExam) {
      return res
        .status(200)
        .json({ error: "Student not registered for this exam" });
    }
    if (submissionDate > exam.endDate) {
      studentExam.grade = 0;
    } else {
      studentExam.grade = grade;
    }

    await studentExam.save();
    res.status(201).json({ message: "Exam solved successfully" });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: solveExam function => ${error}`);
  }
};
