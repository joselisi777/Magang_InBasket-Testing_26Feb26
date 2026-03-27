import { LogsContext } from "../contexts/LogsContext";
import { useContext } from "react";

const ReplyBox = ({ emails, selectedId, replyBox, replyText, setReply, setEmails }) => {
    
    const { logAction } = useContext(LogsContext);

    const sendReply = () => {
        const text = replyText.trim();

        if (!text) {
            alert("Draf balasan kosong.");
            return;
        }

        const curr = emails.find(e => e.id === selectedId);

        const newEmail = {
            id: Date.now(),
            from: "Saya",
            subject: "Re: " + curr.subject,
            body: text,
            time: new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            read: true,
            folder: 'sent',
            snippet: text.substring(0, 40) + "..."
        };

        setEmails(prev => [...prev, newEmail]);

        const storedSent = JSON.parse(localStorage.getItem('sentEmails')) || [];

        storedSent.push(newEmail);

        localStorage.setItem('sentEmails', JSON.stringify(storedSent));

        logAction('ACTION_REPLY', `Membalas Email ID ${curr.id}. Isi: ${text}`);

        replyBox();
        setReply('');

        alert('Balasan dikirim.');
    }

    return ( 
        <div className="reply-box active">
            <div className="reply-header">Balas Pesan:</div>
            <textarea className="reply-textarea" placeholder="Tuliskan draf balasan Anda di sini..." value={replyText} onChange={(e) => setReply(e.target.value)} />
            <div className="reply-button">
                <button className="btn btn-outline" onClick={replyBox}>Batal</button>
                <button className="btn btn-primary" onClick={sendReply}>Kirim Balasan</button>
            </div>
        </div>
     );
}
 
export default ReplyBox;