import {
    useEffect,
    useState,
    useCallback,
} from 'react';

import { useAuth } from '../auth/AuthContext';

import { getChatHistory } from '../api/chatService';

import {
    subscribeToMessages,
    sendChatMessage,
} from '../api/websocketClient';

import UserList from './UserList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const getChatId = (a, b) => {
    return [a, b]
        .sort()
        .join('_');
};

const ChatPage = () => {
    const {
        user,
        logout,
        webSocketConnected,
    } = useAuth();

    const [selectedUser, setSelectedUser] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    /*
     * WebSocket bağlantısı hazır olduğunda
     * mesaj subscription oluştur.
     */
    useEffect(() => {
        if (!webSocketConnected) {
            console.log(
                'ChatPage: WebSocket henüz bağlı değil'
            );

            return;
        }

        console.log(
            'ChatPage: WebSocket hazır, mesajlar dinleniyor'
        );

        const subscription =
            subscribeToMessages(
                (notification) => {
                    console.log(
                        'ChatPage mesaj aldı:',
                        notification
                    );

                    setMessages((prev) => [
                        ...prev,
                        notification,
                    ]);
                }
            );

        return () => {
            if (subscription) {
                subscription.unsubscribe();

                console.log(
                    'ChatPage: Mesaj subscription kaldırıldı'
                );
            }
        };
    }, [webSocketConnected]);

    /*
     * Seçilen kullanıcı ile olan geçmişi getir.
     */
    useEffect(() => {
        if (
            !selectedUser ||
            !user?.nickName
        ) {
            return;
        }

        console.log(
            'ChatPage: Chat geçmişi getiriliyor:',
            user.nickName,
            selectedUser
        );

        getChatHistory(
            user.nickName,
            selectedUser
        )
            .then(({ data }) => {
                console.log(
                    'ChatPage: Chat geçmişi geldi:',
                    data
                );

                setMessages(data);
            })
            .catch((err) => {
                console.error(
                    'Geçmiş alınamadı:',
                    err
                );
            });
    }, [
        selectedUser,
        user?.nickName,
    ]);

    /*
     * Mesaj gönder.
     */
    const handleSend = useCallback(
        (content) => {
            if (!selectedUser) {
                return;
            }

            if (!webSocketConnected) {
                console.error(
                    'WebSocket bağlı değil'
                );

                return;
            }

            const message = {
                chatId: getChatId(
                    user.nickName,
                    selectedUser
                ),

                senderId:
                    user.nickName,

                recipientId:
                    selectedUser,

                content: content,
            };

            console.log(
                'Gönderilecek mesaj:',
                message
            );

            sendChatMessage(message);

            /*
             * Gönderen kendi mesajını
             * beklemeden ekranda görür.
             */
            setMessages((prev) => [
                ...prev,
                message,
            ]);
        },
        [
            selectedUser,
            user?.nickName,
            webSocketConnected,
        ]
    );

    if (!user) {
        return null;
    }

    return (
        <div
            style={{
                display: 'flex',
                height: '100vh',
            }}
        >
            <UserList
                currentUserId={
                    user.nickName
                }
                selectedUserId={
                    selectedUser
                }
                onSelectUser={
                    setSelectedUser
                }
            />

            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection:
                        'column',
                }}
            >
                <div
                    style={{
                        padding: 8,
                        display: 'flex',
                        justifyContent:
                            'space-between',
                    }}
                >
                    <span>
                        {selectedUser
                            ? `${selectedUser} ile sohbet`
                            : 'Bir kullanıcı seç'}
                    </span>

                    <button
                        onClick={logout}
                    >
                        Çıkış
                    </button>
                </div>

                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                    }}
                >
                    <MessageList
                        messages={messages}
                        currentUserId={
                            user.nickName
                        }
                    />
                </div>

                {selectedUser && (
                    <MessageInput
                        onSend={
                            handleSend
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default ChatPage;