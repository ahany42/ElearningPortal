import React from 'react'
import Card from '../Card/Card'
import './Coursescards.css'
const Coursescards = ({ courses, addCourseHandler }) => {
  const myCards = courses.map((course) => {
    return <Card key={course.id} {...course} />;
  });


  return (
    <>
      <i className="fa-solid fa-plus" onClick={addCourseHandler}></i>

      <div className="cards">{myCards}</div>
    </>
  );
};

export default Coursescards
