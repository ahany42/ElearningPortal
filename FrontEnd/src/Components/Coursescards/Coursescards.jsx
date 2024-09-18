import {useEffect, useRef, useState} from 'react'
import Card from '../Card/Card'
import './Coursescards.css'
import AddCourseForm from '../AddCourseForm/Form';
import SearchBar from '../Seach-MUI/Search-MUI';

const Coursescards = ({ courses, addCourseHandler ,filterHandler, setFilter}) => {
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




    const myCards = filterHandler(courses).map((course) => {
      return <Card key={course.id} {...course} />;
    });


    return (
      <>
        {showForm && (
          <AddCourseForm
            addHandler={addCourseHandler}
            showFormHandler={showFormHandler}
          />
        )}
        <span ref={CardsContainer}>
          <div className="d-flex position-relative mt-5 mb-5 justify-content-center">
            <SearchBar setFilter={setFilter} />
            <i
                title="Add Course"
                className="fa-solid fa-plus AddIcon"
                onClick={showFormHandler}
            ></i>
          </div>
          <div className="cards mb-3">
              {
                  !myCards.length && <h1 className="NoCourses">No Courses Found</h1>
              }
              {
                  myCards
              }
          </div>
        </span>
      </>
    );
};

export default Coursescards
