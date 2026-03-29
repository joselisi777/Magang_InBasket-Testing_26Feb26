import { useState, useEffect, useContext } from "react";
import RenderList from "./components/RenderList";
import ActionBar from "./components/ActionBar";
import ReplyBox from "./components/ReplyBox";
import Folder from "./components/Folder";
import Email from "./components/Email";
import Timer from "./components/Timer";
import useFetch from "./customHooks/useFetch";
import { LogsContext } from "./contexts/LogsContext";
import { AuthContext } from "./contexts/AuthContext";

const SimulationTest = () => {

    const { data, loading } = useFetch();
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        if (data) {
            setEmails(data);
        }
    }, [data]);

    const { user } = useContext(AuthContext)
    const { logAction } = useContext(LogsContext);
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

        const stored = JSON.parse(localStorage.getItem('emailOverrides')) || {};
        stored[email.id] = {
            ...stored[email.id],
            read: true
        }
        localStorage.setItem('emailOverrides', JSON.stringify(stored));

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

        const stored = JSON.parse(localStorage.getItem('emailOverrides')) || {};
        stored[selectedEmail.id] = {
            ...stored[selectedEmail.id],
            folder: 'delegated'
        }
        localStorage.setItem('emailOverrides', JSON.stringify(stored));
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

        const stored = JSON.parse(localStorage.getItem('emailOverrides')) || {};
        stored[selectedEmail.id] = {
            ...stored[selectedEmail.id],
            read: true
        };
        localStorage.setItem('emailOverrides', JSON.stringify(stored));
        logAction('ACTION_IGNORE', `Abaikan Email ID ${selectedEmail.id}`);

        setSelectedEmail(null);
        setFolder('inbox');
    };

    const inboxCount = emails.filter(e => e.folder === 'inbox' && !e.read).length;
    const sentCount = emails.filter(e => e.folder === 'sent').length;
    const delegatedCount = emails.filter(e => e.folder === 'delegated').length;
    
    return (
        <div className="app">
            <header className="app-header">
                <div>
                    <div className="header-brand">InsightCore Mail</div>
                    <div className="header-user">{user.name} | {user.role}</div>
                </div>
                <Timer duration={30 * 60} emails={emails}/>
            </header>

            <div className="app-container">
                {<Folder folder={folder} setFolder={handleSetFolder} inboxCount={inboxCount} 
                sentCount={sentCount} delegatedCount={delegatedCount} />}

                <div className="email-list-pane">
                    {<RenderList emails={emails} selectedId={selectedEmail?.id} folder={folder} onSelect={handleSelectEmail} loading={loading}/>}
                </div>

                <div className="reading-pane">
                    {!selectedEmail ? (
                        <div className="empty-state">
                            <p>Pilih email dari daftar untuk membaca konten.</p>
                        </div>
                    ) : (
                        <Email selectedEmail={selectedEmail} />
                    )}

                    {selectedEmail && !showReply && folder !== 'sent' && folder !== 'delegated' && 
                    <ActionBar replyBox={toggleReplyBox} delegate={delegateAction} ignore={ignoreAction} />}

                    {showReply && <ReplyBox emails={emails} selectedId={selectedEmail?.id} 
                    replyBox={toggleReplyBox} replyText={replyText} setReply={setReplyText} setEmails={setEmails} />}
                </div>
            </div>
        </div>
    );
}

export default SimulationTest;