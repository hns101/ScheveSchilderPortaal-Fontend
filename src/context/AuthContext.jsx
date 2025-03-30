import { createContext, useState } from "react";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState({isAuth: false, user: ''});


    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth }}>
            {children}
        </AuthContext.Provider>
    );
}