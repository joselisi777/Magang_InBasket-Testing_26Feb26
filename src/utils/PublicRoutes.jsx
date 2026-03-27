import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const PublicRoutes = () => {
    
    const { user } = useContext(AuthContext);

    if (user) {
        return <Navigate to="/test" />;
    }

    return <Outlet />;
}
 
export default PublicRoutes;