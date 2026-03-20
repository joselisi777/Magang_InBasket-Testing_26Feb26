import RenderList from "./RenderList";
import { useState, useEffect } from "react";
import { db } from "./config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const SimulationTest = () => {

    const [emails, setEmails] = useState([]);
    const [folder, setFolder] = useState('inbox');
    const [selectedEmail, setSelectedEmail] = useState(null);

    useEffect(() => {
        const colRef = collection(db, 'emails');

        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const emailsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setEmails(emailsData);
        });

        return () => unsubscribe();
    }, [])

    return (
        <div className="app-container">
            <div className="sidebar">
                <div className="folder">Folder</div>
                <div className="folder-item active">
                    <span>Kotak Masuk</span> <span id="cnt-inbox" className="badge">0</span>
                </div>
                <div className="folder-item">
                    <span>Terkirim</span> <span id="cnt-sent" className="badge">0</span>
                </div>
                <div className="folder-item">
                    <span>Didelegasikan</span> <span id="cnt-delegated" className="badge">0</span>
                </div>
            </div>

            <div className="email-list-pane">{<RenderList
                emails={emails} selectedId={selectedEmail?.id} folder={folder} onSelect={setSelectedEmail} />}
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

                <div className="action-bar" id="actionBar">
                    <button className="btn btn-primary">Balas</button>
                    <button className="btn btn-outline">Delegasikan</button>
                    <button className="btn btn-outline">Abaikan</button>
                </div>

                <div className="reply-box" id="replyBox">
                    <div className="reply-header">Balas Pesan:</div>
                    <textarea id="replyText" className="reply-textarea" placeholder="Tuliskan draf balasan Anda di sini..."></textarea>
                    <div className="reply-button">
                        <button className="btn btn-outline">Batal</button>
                        <button className="btn btn-primary">Kirim Balasan</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SimulationTest;