import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useState, useEffect } from "react";

const useFetch = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchEmails = async () => {
            const snapshot = await getDocs(collection(db, 'emails'));

            const stored = JSON.parse(localStorage.getItem('emailOverrides')) || {};
            const storedSent = JSON.parse(localStorage.getItem('sentEmails')) || [];

            const firestoreEmails = snapshot.docs.map(doc => {
                const email = {
                    id: doc.id,
                    ...doc.data()
                };

                return {
                    ...email,
                    read: stored[email.id]?.read ?? email.read ?? false,
                    folder: stored[email.id]?.folder ?? email.folder ?? 'inbox'
                };
            });

            const allEmails = [...firestoreEmails, ...storedSent];
            setData(allEmails);
        };

        fetchEmails();
    }, []);

    return { data };
}
 
export default useFetch;