import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { deleteCookie } from "../Cookie/Cookie.jsx";
import { CurrentUserContext } from "../../App.jsx";

const Logout = () => {
    const navigate = useNavigate();
    const { setCurrentUser, setIsAuthenticated } = useContext(CurrentUserContext);

    useEffect(() => {
        setCurrentUser({});
        setIsAuthenticated(false);
        deleteCookie('token');
        navigate('/');
    }, []);

    return null;
}

export default Logout
