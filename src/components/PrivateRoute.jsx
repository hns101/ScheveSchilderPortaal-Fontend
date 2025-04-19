import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Optional utility to check if localStorage contains garbage data
const hasInvalidAuthData = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !token || !user;
};

function PrivateRoute({ children, adminOnly = false }) {
    const { user } = useAuth(); // Provided by AuthContext

    if (!user) {
        // Extra safety: remove garbage token if somehow present
        if (hasInvalidAuthData()) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }

        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !user.roles?.includes("ROLE_ADMIN")) {
        return <Navigate to="/planning" replace />;
    }

    return children;
}

export default PrivateRoute;
