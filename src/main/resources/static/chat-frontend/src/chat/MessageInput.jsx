import { useState } from 'react';

const MessageInput = ({ onSend }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSend(content);
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="message-input">
            <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Mesaj yaz..." />
            <button type="submit">Gönder</button>
        </form>
    );
};

export default MessageInput;