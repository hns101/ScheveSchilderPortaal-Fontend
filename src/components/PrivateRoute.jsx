import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function PrivateRoute({ children }) {
    const { isAuth } = useContext(AuthContext);

    return isAuth.isAuth ? children : <Navigate to="/signin" />;
}

export default PrivateRoute;