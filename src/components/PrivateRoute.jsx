
import { Navigate } from "react-router-dom";
import {AuthContext, useAuth} from "../context/AuthContext";

function PrivateRoute({ children, adminOnly = false }) {
    const { user } = useAuth(); // Get logged-in user

    if (!user) {
        return <Navigate to="/login" />; // Redirect if not logged in
    }

    if (adminOnly && user.role !== "ROLE_ADMIN") {
        return <Navigate to="/planning" />; // Redirect non-admins to home
    }

    return children; // Render protected content
}

export default PrivateRoute;