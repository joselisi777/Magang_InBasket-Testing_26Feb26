const Folder = ({ folder, setFolder, inboxCount, sentCount, delegatedCount }) => {
    return ( 
        <div className="sidebar">
                <div className="folder">Folder</div>
                <div className={`folder-item ${folder === 'inbox' ? 'active' : ''}`}
                    onClick={() => setFolder('inbox')}>
                    <span>Kotak Masuk</span> <span id="cnt-inbox" className="badge">{inboxCount}</span>
                </div>
                <div className={`folder-item ${folder === 'sent' ? 'active' : ''}`}
                    onClick={() => setFolder('sent')}>
                    <span>Terkirim</span> <span id="cnt-sent" className="badge">{sentCount}</span>
                </div>
                <div className={`folder-item ${folder === 'delegated' ? 'active' : ''}`}
                    onClick={() => setFolder('delegated')}>
                    <span>Didelegasikan</span> <span id="cnt-delegated" className="badge">{delegatedCount}</span>
                </div>
        </div>
     );
}
 
export default Folder;