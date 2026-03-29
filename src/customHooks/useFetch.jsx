import { db } from "../config/firebase";
import { get, ref } from "firebase/database";
import { useState, useEffect } from "react";

const useFetch = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmails = async () => {
            const snapshot = await get(ref(db, 'emails/'));

            const stored = JSON.parse(localStorage.getItem('emailOverrides')) || {};
            const storedSent = JSON.parse(localStorage.getItem('sentEmails')) || [];

            const rawData = snapshot.val();

            const firebaseEmails = rawData
                ? Object.entries(rawData).map(([id, value]) => {
                    const email = {
                        id,
                        ...value
                    };

                    return {
                        ...email,
                        read: stored[id]?.read ?? email.read ?? false,
                        folder: stored[id]?.folder ?? email.folder ?? 'inbox'
                    };
                })
                : [];

            const allEmails = [...firebaseEmails, ...storedSent];
            setLoading(false);
            setData(allEmails);
        };

        fetchEmails();
    }, []);

    return { data, loading };
}
 
export default useFetch;