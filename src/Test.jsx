import RenderList from "./RenderList";
import { useState, useEffect, useContext } from "react";
import ActionBar from "./ActionBar";
import ReplyBox from "./ReplyBox";
import Folder from "./Folder";
import Email from "./Email";
import useFetch from "./useFetch";
import { LogsContext } from "./contexts/LogsContext";
import { AuthContext } from "./contexts/AuthContext";

const SimulationTest = () => {

    const { data } = useFetch();
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        if (data) {
            setEmails(data);
        }
    }, [data]);

    const { logs, logAction } = useContext(LogsContext);
    const { user } = useContext(AuthContext);
    const [folder, setFolder] = useState('inbox');
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleSelectEmail = (email) => {
        setSelectedEmail(email);

        setEmails(prev =>
            prev.map(e =>
                e.id === email.id ? { ...e, read: true } : e
            )
        );

        if (email.folder === 'inbox') { logAction('READ_EMAIL', `Membaca ${email.subject}`); }
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

    console.log(user);
    console.log(logs);

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
                    <Email selectedEmail={selectedEmail}/>
                )}

                {selectedEmail && <ActionBar replyBox={toggleReplyBox} delegate={delegateAction} ignore={ignoreAction}/>}

                {showReply && <ReplyBox replyBox={toggleReplyBox} replyText={replyText} setReply={setReplyText}/>}
            </div>
        </div>
    );
}

export default SimulationTest;