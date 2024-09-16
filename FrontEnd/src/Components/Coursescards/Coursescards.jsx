import {useEffect, useRef, useState} from 'react'
import Card from '../Card/Card'
import './Coursescards.css'
import AddCourseForm from '../AddCourseForm/Form';

const Coursescards = ({ courses, addCourseHandler }) => {
    const [showForm, setShowForm] = useState(false);
    const CardsContainer = useRef(null);

    useEffect(() => {
        if (showForm) {
            CardsContainer.current.style.opacity = 0.3;
            CardsContainer.current.style.pointerEvents = 'none';
            CardsContainer.current.style.userSelect = 'none';
        } else {
            CardsContainer.current.style.opacity = 1;
            CardsContainer.current.style.pointerEvents = '';
            CardsContainer.current.style.userSelect = '';
        }
    }, [showForm]);

    const showFormHandler = () => {
      setShowForm(!showForm);
    };

    const myCards = courses.map((course) => {
      return <Card key={course.id} {...course} />;
    });


    return (
        <>
            {showForm && (
                <AddCourseForm addHandler={addCourseHandler} showFormHandler={showFormHandler} />
            )}
            <span ref={CardsContainer}>
                <div className='d-flex'>
                    <i title='Add Course' className="fa-solid fa-plus w-auto me-5 ms-auto"
                       onClick={showFormHandler}></i>
                </div>
              <div className="cards">{myCards}</div>
            </span>
        </>
    );
};

export default Coursescards
