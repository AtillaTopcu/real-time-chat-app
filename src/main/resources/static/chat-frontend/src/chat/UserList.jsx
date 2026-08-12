import { useEffect, useState } from 'react';
import { getConnectedUsers } from '../api/userService';
import { getStompClient, subscribeToOnlineUsers } from '../api/websocketClient';

const UserList = ({ currentUserId, selectedUserId, onSelectUser }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getConnectedUsers()
            .then(({ data }) => setUsers(data.filter((u) => u.nickName !== currentUserId)))
            .catch((err) => console.error('Kullanıcılar alınamadı', err));
    }, [currentUserId]);

    useEffect(() => {
        const client = getStompClient();
        if (!client) return;

        let subscription;

        const trySubscribe = () => {
            if (client.connected) {
                subscription = subscribeToMessages((notification) => {
                    setMessages((prev) => [...prev, notification]);
                });
            }
        };

        trySubscribe();

        return () => subscription?.unsubscribe();
    }, []);

    return (
        <div className="user-list">
            <h3>Online Kullanıcılar</h3>
            {users.map((u) => (
                <div
                    key={u.nickName}
                    onClick={() => onSelectUser(u.nickName)}
                    style={{ fontWeight: u.nickName === selectedUserId ? 'bold' : 'normal', cursor: 'pointer' }}
                >
                    {u.fullName ?? u.nickName}
                </div>
            ))}
        </div>
    );
};

export default UserList;