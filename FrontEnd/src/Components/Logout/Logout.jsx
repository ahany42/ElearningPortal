import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { deleteCookie } from "../Cookie/Cookie.jsx";
import { CurrentUserContext } from "../../App.jsx";
import { toast } from 'react-toastify';

const Logout = () => {
    const navigate = useNavigate();
    const { setCurrentUser, setIsAuthenticated } = useContext(CurrentUserContext);

    useEffect(() => {
        toast.success("You Logged Out Successfully", {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
                userSelect: 'none',
                gap: '10px',
                padding: '20px',
            }
        });
        setCurrentUser({});
        setIsAuthenticated(false);
        deleteCookie('token');
        navigate('/');
    }, []);

    return null;
}

export default Logout
