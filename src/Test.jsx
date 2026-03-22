import RenderList from "./RenderList";
import { useState, useEffect } from "react";
import { db } from "./config/firebase";
import { collection, getDocs } from "firebase/firestore";
import ActionBar from "./ActionBar";
import ReplyBox from "./ReplyBox";
import Folder from "./Folder";

const SimulationTest = () => {

    const [emails, setEmails] = useState([]);
    const [folder, setFolder] = useState('inbox');
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [logs, setLogs] = useState([]);
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        const fetchEmails = async () => {
            const snapshot = await getDocs(collection(db, "emails"));

            const emailsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setEmails(emailsData);
        };

        fetchEmails();
    }, []);

    const handleSelectEmail = (email) => {
        setSelectedEmail(email);

        setEmails(prev =>
            prev.map(e =>
                e.id === email.id ? { ...e, read: true } : e
            )
        );
    };

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

    const handleSetFolder = (folderName) => {
        setFolder(folderName);
        setSelectedEmail(null);
    };

    const toggleReplyBox = () => {
        setShowReply(prev => !prev);
    };

    const delegateAction = () => {
        setEmails(prev =>
            prev.map(e =>
                e.id === selectedEmail.id
                    ? { ...e, folder: 'delegated' }
                    : e
            )
        );

        logAction('ACTION_DELEGATE', `Delegasi Email ID ${selectedEmail.id}`);

        setSelectedEmail(null);
        setFolder('inbox');
    };

    const ignoreAction = () => {
        setEmails(prev =>
            prev.map(e =>
                e.id === selectedEmail.id
                    ? { ...e, read: true }
                    : e
            )
        );

        logAction('ACTION_IGNORE', `Abaikan Email ID ${selectedEmail.id}`);

        setSelectedEmail(null);
        setFolder('inbox');
    };

    const inboxCount = emails.filter(e => e.folder === 'inbox' && !e.read).length;
    const sentCount = emails.filter(e => e.folder === 'sent').length;
    const delegatedCount = emails.filter(e => e.folder === 'delegated').length;

    return (
        <div className="app-container">
            {<Folder folder={folder} setFolder={handleSetFolder} inboxCount={inboxCount} sentCount={sentCount} delegatedCount={delegatedCount}/>}

            <div className="email-list-pane"> 
                {<RenderList emails={emails} selectedId={selectedEmail?.id} folder={folder} onSelect={handleSelectEmail} />}
            </div>

            <div className="reading-pane">
                {!selectedEmail ? (
                    <div className="empty-state">
                        <p>Pilih email dari daftar untuk membaca konten.</p>
                    </div>
                ) : (
                    <div className="email">
                        <div className="email-header">
                            <div className="email-subject">{selectedEmail.subject}</div>

                            <div className="email-meta">
                                <div className="email-sender-info">
                                    <div>{selectedEmail.from}</div>
                                    <div>Ke: Saya</div>
                                </div>
                                <div className="email-time">{selectedEmail.time}</div>
                            </div>
                        </div>

                        <div className="email-body">
                            {selectedEmail.body}
                        </div>
                    </div>
                )}

                {selectedEmail && <ActionBar replyBox={toggleReplyBox} delegate={delegateAction} ignore={ignoreAction}/>}

                {showReply && <ReplyBox replyBox={toggleReplyBox} replyText={replyText} setReply={setReplyText}/>}
            </div>
        </div>
    );
}

export default SimulationTest;