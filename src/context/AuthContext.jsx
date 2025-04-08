import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem("token") || "");

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post(
                "http://localhost:8080/auth/login",
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    withCredentials: false,
                }
            );

            const token = res.data.token;
            setToken(token);
            localStorage.setItem("token", token);

            // Set default token header for axios
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Fetch detailed user info
            const userDetails = await axios.get(
                `http://localhost:8080/register/admin/users/${email}`
            );

            setUser(userDetails.data);
            localStorage.setItem("user", JSON.stringify(userDetails.data));

            return res;
        } catch (error) {
            console.error("Login failed:", error);
            return error;
        }
    };


    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}