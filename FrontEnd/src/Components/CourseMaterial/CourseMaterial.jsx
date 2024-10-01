
import './CourseMaterial.css';
import { toast } from 'react-toastify';
import MaterialCard from '../MaterialCard/MaterialCard';
import { useContext } from 'react'; 
import {CurrentUserContext} from "../../App.jsx";

const CourseMaterial = () => {
    const {materials} = useContext(CurrentUserContext);
  
    //for testing
    // const submitted = false;
    //for testing
    // const solved = true;
    //for testing
    // const seeMore = true;
    const materialList = materials.map(material=>{
        return (
            <MaterialCard key={material.id} material={material} />
        );
    });
    return (
   <>
   {materialList}
   </>
    )
}

export default CourseMaterial
