import { useContext, useState, useEffect } from "react";
import { LogsContext } from "../contexts/LogsContext";

const Timer = ({ duration }) => {
    const { logAction } = useContext(LogsContext);

    useEffect(() => {
        const existing = localStorage.getItem('timerEnd');

        if (!existing) {
            const endTime = Date.now() + duration * 1000;
            localStorage.setItem('timerEnd', endTime);
        }
    }, [duration]);
    
    const getInitialTime = () => {
        const savedEnd = localStorage.getItem('timerEnd');

        if (!savedEnd) return duration;

        return Math.max(0, Math.floor((savedEnd - Date.now()) / 1000));
    };

    const [time, setTime] = useState(getInitialTime);

    const m = Math.floor(time / 60);
    const s = time % 60;
    const display =
        m.toString().padStart(2, '0') +
        ':' +
        s.toString().padStart(2, '0');

    useEffect(() => {
        const timer = setInterval(() => {
            const end = Number(localStorage.getItem('timerEnd'));

            if (!end) return;

            const remaining = Math.max(0, Math.floor((end - Date.now()) / 1000));

            setTime(remaining);

            if (remaining <= 0) {
                clearInterval(timer);
                localStorage.removeItem('timerEnd');
                logAction('TIMEOUT', 'Waktu habis.');
                // executeFinish();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return ( 
        <div className="button-timer">
            <div className="timer-display">{display}</div>
            <button className="btn btn-outline">Selesaikan Ujian</button>
        </div>
     );
}
 
export default Timer;