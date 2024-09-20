import Coursescards from "../Coursescards/Coursescards";
const CoursesPage = (courses,addCourseHandler,filterHandler,setFilter,isAuthenticated) => {
  return (
    <>
      <Coursescards courses={courses} addCourseHandler={addCourseHandler} filterHandler={filterHandler} setFilter={setFilter} isAuthenticated={isAuthenticated}/>
                    
    </>
  )
}

export default CoursesPage
