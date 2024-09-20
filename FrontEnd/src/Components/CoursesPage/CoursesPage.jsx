import CoursesCards from '../Coursescards/Coursescards';
const CoursesPage = (courses,addCourseHandler,filterHandler,setFilter,isAuthenticated) => {
  return (
    <>
      <CoursesCards courses={courses} addCourseHandler={addCourseHandler} filterHandler={filterHandler} setFilter={setFilter} isAuthenticated={isAuthenticated}/>
                    
    </>
  )
}

export default CoursesPage
