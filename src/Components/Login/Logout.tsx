import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();        
        navigate(`/`);        
        navigate(0);
    }

    useEffect(() => {
        handleLogout();
    }, []);

    return (
        <div>
            You will be logged out in a few seconds...
        </div>
    )
}

export default Logout;