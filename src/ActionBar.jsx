const ActionBar = ({ replyBox, delegate, ignore }) => {
    return ( 
        <div className="action-bar" id="actionBar">
            <button className="btn btn-primary" onClick={replyBox}>Balas</button>
            <button className="btn btn-outline" onClick={delegate}>Delegasikan</button>
            <button className="btn btn-outline" onClick={ignore}>Abaikan</button>
        </div>
     );
}
 
export default ActionBar;