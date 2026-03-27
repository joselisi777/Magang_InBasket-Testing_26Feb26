import { useState, useEffect } from "react";

const useLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('logs')) || [];
        setLogs(stored);
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded) {
            localStorage.setItem('logs', JSON.stringify(logs));
        }
    }, [logs, loaded]);

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