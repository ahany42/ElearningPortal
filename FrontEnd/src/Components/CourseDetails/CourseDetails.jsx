import { useParams } from "react-router"
const CourseDetails = () => {
    const {id} = useParams();
  return (
    <>
      <h3>Course Id {id}</h3>
    </>
  )
}

export default CourseDetails
