import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogsContext } from "../contexts/LogsContext";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../config/firebase";
import { ref, set } from "firebase/database";

const Timer = ({ duration, emails }) => {
    const { logs, logAction } = useContext(LogsContext);
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const existing = localStorage.getItem('timerEnd');

        if (!existing) {
            const endTime = Date.now() + duration * 1000;
            localStorage.setItem('timerEnd', endTime);
        }
    }, [duration, user]);
    
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
        timerRef.current = setInterval(() => {
            const end = Number(localStorage.getItem('timerEnd'));

            if (!end) return;

            const remaining = Math.max(0, Math.floor((end - Date.now()) / 1000));

            setTime(remaining);

            if (remaining <= 0) {
                clearInterval(timerRef.current);
                logAction('TIMEOUT', 'Waktu habis.');
                executeFinish();
            }
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, []);

    const executeFinish = async () => {
        if (!user) {
            alert("User tidak ditemukan.");
            return;
        }

        clearInterval(timerRef.current);
        localStorage.removeItem('timerEnd');
        setLoading(true);

        const payload = {
            candidateInfo: user,
            metrics: {
                totalInbox: emails.filter(e => e.folder === 'inbox').length,
                emailsRead: emails.filter(e => e.read && e.from !== "Saya").length,
                repliesSent: emails.filter(e => e.folder === 'sent').length,
                delegatedItems: emails.filter(e => e.folder === 'delegated').length
            },
            actionLogs: logs,
            submissionTime: new Date().toISOString()
        };

        const safeName = user.name.replace(/[^a-zA-Z0-9]/g, '_');
        const dbKey = `${safeName}_${user.voucherCode}`;

        const submissionRef = ref(db, 'submissions/' + dbKey);

        try {
            await set(submissionRef, payload);
            localStorage.removeItem('logs');
            localStorage.removeItem('emailOverrides');
            localStorage.removeItem('sentEmails');
            localStorage.removeItem('user');
            alert("Data berhasil direkam...");

            setUser(null);
            navigate('/');
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return ( 
        <div className="button-timer">
            <div className="timer-display">{display}</div>
            <button
                className="btn btn-outline"
                onClick={executeFinish}
                disabled={loading}
            >
                {loading ? "Menyimpan..." : "Selesaikan Ujian"}
            </button>
        </div>
     );
}
 
export default Timer;