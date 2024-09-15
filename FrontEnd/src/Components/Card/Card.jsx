import React from 'react'
import './Card.css'

const Card = ({ id, title, desc, hours }) => {
  return (
    <div className="myCard" key={id}>
      <i className="fa-solid fa-pen-to-square"></i>
      <h4>{title}</h4>
      <ul>
        <li >{desc}</li>
        <li>{hours}</li>
      </ul>
      <i className="fa-solid fa-folder"></i>
      <i className="fa-solid fa-list-check"></i>
    </div>
  );
};

export default Card
