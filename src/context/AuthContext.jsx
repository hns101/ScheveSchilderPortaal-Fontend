import { createContext, useContext, useState } from "react";
// Import our new API clients
import { apiClient, authApiClient } from "../api/api.js";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // We no longer need to manage the token in state here for API calls
    // The authApiClient will get it from localStorage directly.

    // REMOVED: The useEffect that set the global default header.

    const login = async (email, password) => {
        try {
            // Use the PUBLIC apiClient for the login request
            const res = await apiClient.post(
                "/auth/login",
                { email, password }
            );

            const token = res.data.token;
            localStorage.setItem("token", token);

            // Fetch detailed user info using the PRIVATE authApiClient
            const userDetails = await authApiClient.get(`/users/${email}`);

            setUser(userDetails.data);
            localStorage.setItem("user", JSON.stringify(userDetails.data));

            return res;
        } catch (error) {
            console.error("Login failed:", error);
            // It's better to throw the error to be handled by the component
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    // We can still provide the token for other uses if needed, but it's not used for API calls anymore
    const token = localStorage.getItem("token");

    return (
        <AuthContext.Provider value={{ user, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}