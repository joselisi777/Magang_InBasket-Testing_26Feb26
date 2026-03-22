const ReplyBox = ({ replyBox, replyText, setReply }) => {
    return ( 
        <div className="reply-box active">
            <div className="reply-header">Balas Pesan:</div>
            <textarea className="reply-textarea" placeholder="Tuliskan draf balasan Anda di sini..." value={replyText} onChange={(e) => setReply(e.target.value)} />
            <div className="reply-button">
                <button className="btn btn-outline" onClick={replyBox}>Batal</button>
                <button className="btn btn-primary" onClick={replyBox}>Kirim Balasan</button>
            </div>
        </div>
     );
}
 
export default ReplyBox;