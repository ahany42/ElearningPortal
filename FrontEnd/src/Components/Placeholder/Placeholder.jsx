import { NavLink } from 'react-router-dom'
import './Placeholder.css'
const Placeholder = ({img,text,buttonText,buttonRoute}) => {
  return (
    <>
     <div className="page-component d-flex flex-column align-items-center gap-4 container">
         <img draggable='false' src={img} className="PlaceholderImage" alt="Placeholder"/>
         <div className="TextContainer">
            <h3>{text}</h3>
         </div>
        {buttonText && <div className="button-container">
          <NavLink to={buttonRoute} className="green-bg light-text placeholder-button">{buttonText}</NavLink>
          </div>}
     </div>
    </>
  )
}

export default Placeholder
