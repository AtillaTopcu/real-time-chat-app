const MessageList = ({ messages, currentUserId }) => {
    return (
        <div className="message-list">
            {messages.map((m) => (
                <div
                    key={m.id ?? `${m.senderId}-${m.timestamp}-${Math.random()}`}
                    style={{ textAlign: m.senderId === currentUserId ? 'right' : 'left' }}
                >
                    <span>{m.content}</span>
                </div>
            ))}
        </div>
    );
};

export default MessageList;