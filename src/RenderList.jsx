const RenderList = ({ emails, selectedId, onSelect, folder }) => {
    const list = emails
        .filter(e => e.folder === folder)
        .sort((a, b) =>
            a.read === b.read ? b.id - a.id : (a.read ? 1 : -1)
        );

    if (list.length === 0) {
        return (
            <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                Kosong.
            </div>
        );
    }

    return (
        <div className="email-list">
            {list.map((email) => (
                <div key={email.id} 
                    className={`email-preview ${email.read ? "" : "unread"} 
                    ${selectedId === email.id ? "active" : ""}`}
                    onClick={() => onSelect(email)}>
                    <div className="sender">
                        <span style={{ fontWeight: email.read ? "500" : "700" }}>
                            <span
                                className={`priority-indicator ${email.priority === "high"
                                        ? "priority-high"
                                        : "priority-normal"
                                    }`}
                            ></span>
                            {email.from}
                        </span>
                        <span>{email.time}</span>
                    </div>

                    <div className="subj">{email.subject}</div>
                    <div className="snippet">{email.snippet}</div>
                </div>
            ))}
        </div>
     );
}
 
export default RenderList;