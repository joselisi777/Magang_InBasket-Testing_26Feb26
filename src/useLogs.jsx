import { useState } from "react";

const useLogs = () => {
    const [logs, setLogs] = useState([]);

    const logAction = (act, det) => {
        setLogs(prev => [
            ...prev,
            {
                action: act,
                detail: det,
                time: new Date().toLocaleTimeString('id-ID', { hour12: false })
            }
        ]);
    };

    return { logs, logAction };
};
 
export default useLogs;