import React from 'react'
import './CourseCard.css'
import { Button } from '@mui/material'

const CourseCard = ({ id, title, desc, hours, isAuthenticated}) => {
    if (isAuthenticated) {
        return (
            <div className="myCard" key={id}>
                <i title='Edit Course' className="fa-solid fa-pen-to-square"></i>
                <h4 className="pascalCase-text bold-text">{title}</h4>
                <ul>
                    <li>{desc}</li>
                    <li>{hours} Hours</li>
                </ul>
                <i title='Exams' className="examIcon fa-solid fa-file-lines"></i>
                <i title='Solved Assignments' className="fa-solid fa-folder"></i>
                <i title='Assignments' className="fa-solid fa-list-check"></i>
                <Button>Enroll</Button>
            </div>
        )
    } else {
        return (
            <div className="myCard" key={id}>
                <h4 className="pascalCase-text bold-text">{title}</h4>
                <ul>
                    <li>{desc}</li>
                    <li>{hours} Hours</li>
                </ul>
                <Button className="enroll">Enroll</Button>
            </div>
        )
    }
};

export default CourseCard
