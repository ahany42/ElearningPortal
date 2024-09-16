import React from 'react'
import './Card.css'
import ExamIcon from '../../assets/exam-icon.webp'

const Card = ({ id, title, desc, hours }) => {
  return (
      <div className="myCard" key={id}>
          <i className="fa-solid fa-pen-to-square"></i>
          <h4>{title}</h4>
          <ul>
              <li>{desc}</li>
              <li>{hours}</li>
          </ul>
          <i title='Exams' className="examIcon fa-solid fa-file-lines"></i>
          <i title='Solved Assignments' className="fa-solid fa-folder"></i>
          <i title='Assignments' className="fa-solid fa-list-check"></i>
      </div>
  );
};

export default Card
