import { db } from "./config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useState, useEffect } from "react";

const useFetch = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchEmails = async () => {
            const snapshot = await getDocs(collection(db, 'emails'));

            const emailsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setData(emailsData);
        };

        fetchEmails();
    }, []);

    return { data };
}
 
export default useFetch;