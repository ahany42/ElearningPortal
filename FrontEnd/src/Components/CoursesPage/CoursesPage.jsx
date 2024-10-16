import CoursesCards from '../Coursescards/Coursescards';

const CoursesPage = ({ courses, filterHandler, setFilter,enrolled, mode }) => {
   return (
      <>
          <CoursesCards courses={courses} mode={mode}
                        filterHandler={filterHandler} setFilter={setFilter} enrolled={enrolled}
          />
      </>
    )
}

export default CoursesPage
