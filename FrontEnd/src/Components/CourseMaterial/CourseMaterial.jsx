import './CourseMaterial.css';
const CourseMaterial = ({materialType}) => {
  return (
  <>
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
    </>
   
  )
}

export default CourseMaterial
