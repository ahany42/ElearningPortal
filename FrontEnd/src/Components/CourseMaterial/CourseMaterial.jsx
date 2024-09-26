import './CourseMaterial.css';
const CourseMaterial = ({materialType}) => {
  return (
    <div className="course-material">
    {/* for testing */}
    { materialType === "exam"?(
    <div className=" card material-card ">
    <div className="material-header card-header">
        m
    </div>
    </div>
    ):materialType=== "assignment"?(
        <div className="material-card">

        </div>
    ):materialType === "announcement"?(
        <div className="material-card">

        </div>
    ):null}
    </div>
  )
}

export default CourseMaterial
