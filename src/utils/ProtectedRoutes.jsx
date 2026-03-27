import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoutes = () => {

    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;