import Placeholder from "../Placeholder/Placeholder.jsx";
import NotFoundImg from "../../assets/404.svg";
import {Button} from "@mui/material";
import {NavLink} from "react-router-dom";
import {useEffect} from "react";

const PageNotFound = () => {

    return (
        <div className='d-flex flex-column align-items-center gap-4'>
            <Placeholder img={NotFoundImg} text="Page Not Found"/>
            {/* <Button component={NavLink} to='/' variant='contained' color='error'>Go Back Home</Button> */}
        </div>
    )
}

export default PageNotFound;