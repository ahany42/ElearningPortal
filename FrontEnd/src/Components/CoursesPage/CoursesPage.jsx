import CoursesCards from '../Coursescards/Coursescards';
import { CurrentUserContext } from "../../App";
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import {toast} from "react-toastify";

const CoursesPage = ({ courses, addCourseHandler, filterHandler, setFilter,enrolled, mode }) => {

    // CHANGE "courses" with "coursesList" in Props for CourseCards, when API is ready
    return (
      <>
          <CoursesCards courses={courses} addCourseHandler={addCourseHandler} mode={mode}
                        filterHandler={filterHandler} setFilter={setFilter} enrolled={enrolled}
          />
      </>
    )
}

export default CoursesPage
