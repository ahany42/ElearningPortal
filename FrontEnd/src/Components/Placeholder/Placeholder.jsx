import './Placeholder.css'
const Placeholder = ({img,text}) => {
  return (
    <>
     <div className="page-component">
         <img width='300' src={img} className="PlaceholderImage" alt="Placeholder"/>
         <div className="TextContainer">
            <h3>{text}</h3>
         </div>
     </div>
    </>
  )
}

export default Placeholder
