import React, { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../../App";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../Cookie/Cookie";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import "./exam-questions.css";

const ExamQuestions = () => {
  const { showMessage } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const { examId } = useParams();
  const yourToken = getCookie("token");
  const userData = jwtDecode(yourToken);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  const fetchExamHandler = async () => {
    try {
      const response = await fetch(`http://localhost:3008/getExam/${examId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${yourToken}`,
        },
        body: JSON.stringify({
          userId: `${userData.id}`,
        }),
      });
      const data = await response.json();
      setExam(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExamHandler();
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
    const numberOfCorrectAnswers = answers.filter(
      (answer) => answer.isCorrect
    ).length;
    const numberOfQuestions = answers.length;
    const grade = (numberOfCorrectAnswers / numberOfQuestions) * 100;
    try {
      const response = await fetch(
        `http://localhost:3008/solveExam/${examId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${yourToken}`,
          },
          body: JSON.stringify({
            studentId: `${userData.id}`,
            grade,
            submissionDate: new Date(),
          }),
        }
      );
      const result = await response.json();
      showMessage(result, null);
      navigate(`/deadline/`);
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const handleEditChange = (index, field, value) => {
    const question = exam.questions[index];
    console.log(question);
    const updatedQuestions = [...exam.questions];
    if (field === "title") {
      updatedQuestions[index].title = value;
    } else if (field === "indexOfCorrectAnswer") {
      updatedQuestions[index].correctAnswer =
        updatedQuestions[index].answers[parseInt(value)];
    } else {
      updatedQuestions[index].answers[field] = value;
    }
    setExam({ ...exam, questions: updatedQuestions });
  };

  const editQuestionHandler = async (index) => {
    const questionId = exam.questions[index].id;
    console.log(editingIndex);
    console.log(exam.questions[index]);
    if (editingIndex === index) {
      try {
        const response = await fetch(
          `http://localhost:3008/updateQuestion/${questionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${yourToken}`,
            },
            body: JSON.stringify({
              title: exam.questions[index].title,
              answers: exam.questions[index].answers,
              indexOfCorrectAnswer: exam.questions[index].answers.indexOf(
                exam.questions[index].correctAnswer
              ),
            }),
          }
        );
        const result = await response.json();
        showMessage(result, null);

        // navigate(`/courses/`);
      } catch (error) {
        console.error("Error submitting answers:", error);
      }
      setEditingIndex(null); // Save and exit editing mode
    } else {
      setEditingIndex(index);
      // Enter editing mode for the selected question
    }
  };
  const deleteQuestionHandler = async (index) => {
    const questionId = exam.questions[index].id;
    try {
      const response = await fetch(
        `http://localhost:3008/deleteQuestion/${questionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${yourToken}`,
          },
        }
      );
      const result = await response.json();
      console.log(result);
      setExam((prevExam) => ({
        ...prevExam,
        questions: prevExam.questions.filter((_, idx) => idx !== index),
      }));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };
  return (
    <>
      {userData.role === "Student" && (
        <div className="container">
          {exam.questions.map((question, index) => (
            <div key={index} className="mx-5 my-4 px-3 py-2 exam-question">
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
      {userData.role === "Instructor" && (
        <div className="container">
          <h2 className="text-center text-white py-3">{exam.ExamTitle}</h2>
          {exam.questions.map((question, index) => (
            <div
              key={index}
              className="form-check mx-5 my-2 bg-body-secondary px-3 py-2"
            >
              <div className="d-flex justify-content-between align-items-center edit-question-info">
                <div>
                  <label htmlFor={`questionTitle-${index}`} className="me-1">
                    Question title:
                  </label>
                  <input
                    id={`questionTitle-${index}`}
                    value={
                      editingIndex === index ? question.title : question.title
                    }
                    disabled={editingIndex !== index}
                    onChange={(e) =>
                      handleEditChange(index, "title", e.target.value)
                    }
                  />
                </div>
              </div>
              {question.answers.map((answer, idx) => (
                <div key={idx} className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={question.title}
                    value={answer}
                    id={`${question.title}-${idx}`}
                    disabled={editingIndex !== index}
                  />
                  <label htmlFor={`${question.title}-${idx}`}>
                    <input
                      type="text"
                      value={editingIndex === index ? answer : answer}
                      disabled={editingIndex !== index}
                      onChange={(e) =>
                        handleEditChange(index, idx, e.target.value)
                      }
                    />
                  </label>
                </div>
              ))}
              <div className="d-flex justify-content-between align-items-center edit-question-info">
                <div>
                  <label htmlFor={`correctAnswer-${index}`} className="me-1">
                    Index of Correct Answer:
                  </label>
                  <input
                    id={`correctAnswer-${index}`}
                    type="number"
                    value={
                      editingIndex === index
                        ? question.answers.indexOf(question.correctAnswer)
                        : question.answers.indexOf(question.correctAnswer)
                    }
                    disabled={editingIndex !== index}
                    min="0"
                    max="3"
                    onChange={(e) =>
                      handleEditChange(
                        index,
                        "indexOfCorrectAnswer",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => editQuestionHandler(index)}
                >
                  {editingIndex === index ? "Save" : "Edit"}
                </button>
                <button
                  type="button"
                  className="btn btn-danger ms-2"
                  onClick={() => deleteQuestionHandler(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ExamQuestions;
