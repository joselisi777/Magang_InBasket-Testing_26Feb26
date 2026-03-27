import { createContext, useContext, useState, useEffect } from "react";
import { LogsContext } from "./LogsContext";
import { db } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";

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

    const startApp = async (name, role, code) => {
        const newUser = { name, role, voucherCode: code, loginTime: new Date().toISOString() };
        setUser(newUser);

        await addDoc(collection(db, 'users'), newUser);
        logAction('START', `Login sukses menggunakan voucher ${code}`);
    };

    return ( 
        <AuthContext.Provider value={{ user, startApp }}>
            {children}
        </AuthContext.Provider>
     );
}
 
export default AuthContextProvider;