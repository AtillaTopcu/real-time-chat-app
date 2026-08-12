import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

const WS_BASE_URL = 'http://localhost:8080/ws';

let stompClient = null;

export const connectWebSocket = (token, onConnect, onError) => {
    // Zaten bağlıysa tekrar bağlantı oluşturma
    if (stompClient?.connected) {
        console.log('WebSocket zaten bağlı');

        onConnect?.(stompClient, null);

        return stompClient;
    }

    // Bağlanma işlemi zaten devam ediyorsa tekrar başlatma
    if (stompClient?.active) {
        console.log('WebSocket bağlantısı zaten devam ediyor');

        return stompClient;
    }

    stompClient = new Client({
        webSocketFactory: () =>
            new SockJS(`${WS_BASE_URL}?token=${token}`),

        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        reconnectDelay: 5000,

        debug: () => {},
    });

    stompClient.onConnect = (frame) => {
        console.log('WebSocket bağlandı');

        /*
         * STOMP bağlantısı gerçekten kurulduktan sonra
         * kullanıcıyı online olarak bildir.
         */
        stompClient.publish({
            destination: '/app/user.addUser',
            body: JSON.stringify({}),
        });

        /*
         * ChatPage gibi bağlantıyı bekleyen yerleri haberdar et.
         */
        onConnect?.(stompClient, frame);
    };

    stompClient.onStompError = (frame) => {
        console.error(
            'STOMP hatası:',
            frame.headers?.message,
            frame.body
        );

        onError?.(frame);
    };

    stompClient.onWebSocketError = (event) => {
        console.error(
            'WebSocket bağlantı hatası:',
            event
        );

        onError?.(event);
    };

    stompClient.activate();

    return stompClient;
};

export const disconnectWebSocket = () => {
    if (!stompClient) {
        return;
    }

    if (stompClient.connected) {
        stompClient.publish({
            destination: '/app/user.disconnectUser',
            body: JSON.stringify({}),
        });
    }

    stompClient.deactivate();

    stompClient = null;
};

export const getStompClient = () => {
    return stompClient;
};

export const sendChatMessage = (message) => {
    if (!stompClient || !stompClient.connected) {
        console.error(
            'WebSocket bağlı değil, mesaj gönderilemedi'
        );

        return;
    }

    console.log(
        'Chat mesajı gönderiliyor:',
        message
    );

    stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(message),
    });
};

export const subscribeToMessages = (onMessageReceived) => {
    if (!stompClient || !stompClient.connected) {
        console.error(
            'WebSocket bağlı değil, subscription oluşturulamadı'
        );

        return null;
    }

    console.log(
        'Mesaj subscription oluşturuldu'
    );

    return stompClient.subscribe(
        '/user/queue/messages',
        (message) => {
            console.log(
                'WebSocket mesajı geldi:',
                message.body
            );

            const parsedMessage =
                JSON.parse(message.body);

            onMessageReceived(parsedMessage);
        }
    );
};

export const subscribeToOnlineUsers = (onUserEvent) => {
    if (!stompClient || !stompClient.connected) {
        console.error(
            'WebSocket bağlı değil, online users subscription oluşturulamadı'
        );

        return null;
    }

    return stompClient.subscribe(
        '/topic/onlineUsers',
        (message) => {
            onUserEvent(
                JSON.parse(message.body)
            );
        }
    );
};