import React from 'react'
import Card from '../Card/Card'
import './Coursescards.css'
const Coursescards = ({ courses, addCourseHandler }) => {
  const myCards = courses.map((course) => {
    return <Card key={course.id} {...course} />;
  });


  return (
    <div className="cards">
      <i className="fa-solid fa-plus" onClick={addCourseHandler}></i>
      {myCards}
    </div>
  );
};

export default Coursescards
