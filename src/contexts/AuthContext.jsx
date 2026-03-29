import { createContext, useContext, useState, useEffect } from "react";
import { LogsContext } from "./LogsContext";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const { logAction } = useContext(LogsContext);    

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded && user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user, loaded]);

    const startApp = (name, role, code) => {
        const newUser = { 
            name, 
            role, 
            voucherCode: code, 
            loginTime: new Date().toISOString() 
        };

        setUser(newUser);

        logAction('START', `Login sukses menggunakan voucher ${code}`);
    };

    return ( 
        <AuthContext.Provider value={{ user, setUser, startApp }}>
            {children}
        </AuthContext.Provider>
     );
}
 
export default AuthContextProvider;