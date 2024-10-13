import React, { useState, useEffect } from "react";
import { getCookie } from "../Cookie/Cookie";

const SolveExam = ({ examId }) => {
  const [exam, setExam] = useState(null);

  const fetchExamHandler = async () => {
    try {
      const yourToken = getCookie("token");
      const response = await fetch(
        `http://localhost:3008/getExam/a6bc188c-0cac-4407-9ac7-da47f1b66d4c`, //replace this id with the specific exam id
        {
          // replace this ID with exam id
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${yourToken}`,
          },
        }
      );
      const text = await response.text();

      try {
        const result = JSON.parse(text);
        if (result.error) {
          console.error(result.error);
        } else {
          setExam(result.data);
          console.log(result.data);
        }
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExamHandler(); // Fetch exam data when component mounts
  }, [examId]);

  if (!exam) return <div>Loading...</div>;

  return (
    <div>
      <h1>{exam.ExamTitle}</h1>
      {/* Render the exam details and questions here */}
      {exam.questions.map((question, index) => (
        <div key={index}>
          <h2>{question.title}</h2>
          <ul>
            {question.answers.map((answer, idx) => (
              <li key={idx}>{answer}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SolveExam;
