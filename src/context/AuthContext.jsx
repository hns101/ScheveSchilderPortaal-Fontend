import { createContext, useContext, useState } from "react";
import { apiClient, authApiClient } from "../api/api.js";
import { jwtDecode } from "jwt-decode"; // Import the JWT decoding library

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        // This function now runs only once on initial load
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            try {
                const decodedToken = jwtDecode(token);
                // Check if the token's expiration time is in the past
                if (decodedToken.exp * 1000 < Date.now()) {
                    // Token is expired, clear storage and return null
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    return null;
                }
                // Token is valid, return the parsed user object
                return JSON.parse(storedUser);
            } catch (e) {
                // If token is malformed, clear storage and return null
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                return null;
            }
        }
        // No token or user found in storage
        return null;
    });

    const login = async (email, password) => {
        try {
            const res = await apiClient.post("/auth/login", { email, password });
            const token = res.data.token;
            localStorage.setItem("token", token);

            const userDetails = await authApiClient.get(`/users/${email}`);
            setUser(userDetails.data);
            localStorage.setItem("user", JSON.stringify(userDetails.data));

            return res;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}