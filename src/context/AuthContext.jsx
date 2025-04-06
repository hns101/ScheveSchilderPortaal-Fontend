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
                        "Accept": "application/json",
                    },
                    withCredentials: false,
                }
            );
            // console.log("Login Response:", res); // Debugging
            setToken(res.token);
            localStorage.setItem("token", res.data.token);
            setUser({ email, role: res.data.role });
            localStorage.setItem("user", JSON.stringify({ email, role: res.data.role }));
            return res;
        } catch (error) {
            console.error(error);
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