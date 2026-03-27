const Email = ({ selectedEmail }) => {

    return ( 
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
     );
}
 
export default Email;