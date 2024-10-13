import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../Cookie/Cookie";
import Loader from "../Loader/Loader";
import "./exam-questions.css";

const ExamQuestions = ({ examId }) => {
  const yourToken = getCookie("token");
  const userData = jwtDecode(yourToken);
  console.log(userData);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const fetchExamHandler = async () => {
    try {
      const response = await fetch(
        `http://localhost:3008/getExam/a6bc188c-0cac-4407-9ac7-da47f1b66d4c`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${yourToken}`,
          },
          body: JSON.stringify({
            userId: `4ca07905-c912-43c7-b3f9-75e03f144b6e`,
          }),
        }
      );
      const data = await response.json();
      setExam(data.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchExamHandler(); // Fetch exam data when component mounts
  }, [examId]);

  if (!exam) return <Loader />;

  const chooseAnswerHandler = (event) => {
    const answer = event.target.value;
    const correctAnswer = exam.questions[questionIndex].correctAnswer;
    if (answer === correctAnswer) {
      setAnswers([...answers, { answer, isCorrect: true }]);
    } else {
      setAnswers([...answers, { answer, isCorrect: false }]);
    }
    setQuestionIndex((prevQuestionIndex) => prevQuestionIndex + 1);
  };

  const submitAnswersHandler = async () => {
    const nomberOfCorrectAnswers = answers.filter(
      (answer) => answer.isCorrect
    ).length;
    const numberOfQuestions = answers.length;
    const grade = (nomberOfCorrectAnswers / numberOfQuestions) * 100;
    console.log(grade);
    try {
      const response = await fetch(
        `http://localhost:3008/solveExam/a6bc188c-0cac-4407-9ac7-da47f1b66d4c`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${yourToken}`,
          },
          body: JSON.stringify({
            studentId: `09fd8b04-110d-4354-92e7-40a63b61581c`,
            grade,
            submissionDate: new Date(),
          }),
        }
      );
      const result = await response.json();
      console.log(result); // Handle the response from the server
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  return (
    <>
      {userData.role === "Student" && (
        <div>
          <h2 className="text-center text-white py-3">{exam.ExamTitle}</h2>
          {exam.questions.map((question, index) => (
            <div key={index} className="mx-5 my-2 bg-body-secondary px-3 py-2">
              <h3 className="mb-3">{question.title}</h3>
              {question.answers.map((answer, idx) => (
                <div key={idx} className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={question.title}
                    value={answer}
                    id={`${question.title}-${idx}`}
                    onClick={chooseAnswerHandler}
                  />
                  <label htmlFor={`${question.title}-${idx}`}>{answer}</label>
                </div>
              ))}
            </div>
          ))}
          <div className="text-end mx-5">
            <button
              type="button"
              className="btn btn-primary"
              onClick={submitAnswersHandler}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* {userData.role === "Instructor" && (
        <div>
          <div className="d-flex justify-content-center">
            <h2 className="text-center text-white py-3">{exam.ExamTitle}</h2>
            <button type="button" className="btn btn-primary">
              Edit
            </button>
          </div>

          {exam.questions.map((question, index) => (
            <div key={index} className="mx-5 my-2 bg-body-secondary px-3 py-2">
              <h3 className="mb-3">{question.title}</h3>
              {question.answers.map((answer, idx) => (
                <div key={idx} className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={question.title}
                    value={answer}
                    id={`${question.title}-${idx}`}
                    onClick={chooseAnswerHandler}
                  />
                  <label htmlFor={`${question.title}-${idx}`}>{answer}</label>
                </div>
              ))}
              <button type="button" className="btn btn-primary">
                Edit
              </button>
            </div>
          ))}
        </div>
      )} */}
    </>
  );
};

export default ExamQuestions;
