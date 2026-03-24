import { createContext } from "react";
import useLogs from "../useLogs";

export const LogsContext = createContext();

const LogsContextProvider = ({ children }) => {

    const { logs, logAction } = useLogs();

    return ( 
        <LogsContext.Provider value={{ logs, logAction }}>
            {children}
        </LogsContext.Provider>
     );
}
 
export default LogsContextProvider;