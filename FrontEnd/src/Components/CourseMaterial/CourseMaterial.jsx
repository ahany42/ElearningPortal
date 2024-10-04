import './CourseMaterial.css';
import MaterialCard from '../MaterialCard/MaterialCard';
import { useContext } from 'react'; 
import {CurrentUserContext} from "../../App.jsx";
import Placeholder from '../Placeholder/Placeholder.jsx';
import NoMaterialsImg from "../../assets/Student.svg";

const CourseMaterial = () => {
  const { materials } = useContext(CurrentUserContext);
  return(
    <>
      {materials.length > 0 ? (
        materials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))
      ) : (
        <Placeholder
          img={NoMaterialsImg}
          text="No materials available."
        />
      )}
    </>
  );
};

export default CourseMaterial
