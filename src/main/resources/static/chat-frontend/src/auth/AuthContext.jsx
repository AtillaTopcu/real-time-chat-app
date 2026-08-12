import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import { jwtDecode } from 'jwt-decode';

import * as authService from '../api/authService';

import {
    connectWebSocket,
    disconnectWebSocket,
} from '../api/websocketClient';

const AuthContext = createContext(null);

const decodeUser = (token) => {
    try {
        const decoded = jwtDecode(token);

        return {
            nickName: decoded.sub,
            token: token,
        };
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [webSocketConnected, setWebSocketConnected] =
        useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            return;
        }

        const decoded = decodeUser(token);

        if (!decoded) {
            localStorage.removeItem('token');
            setLoading(false);
            return;
        }

        setUser(decoded);

        connectWebSocket(
            token,

            () => {
                console.log(
                    'AuthContext: WebSocket bağlantısı başarılı'
                );

                setWebSocketConnected(true);
            },

            (error) => {
                console.error(
                    'AuthContext WebSocket hatası:',
                    error
                );

                setWebSocketConnected(false);
            }
        );

        setLoading(false);
    }, []);

    const login = async (
        nickName,
        password
    ) => {
        const { data } =
            await authService.login(
                nickName,
                password
            );

        localStorage.setItem(
            'token',
            data.token
        );

        const decoded =
            decodeUser(data.token);

        setUser(decoded);

        setWebSocketConnected(false);

        connectWebSocket(
            data.token,

            () => {
                console.log(
                    'Login: WebSocket bağlantısı başarılı'
                );

                setWebSocketConnected(true);
            },

            (error) => {
                console.error(
                    'Login WebSocket hatası:',
                    error
                );

                setWebSocketConnected(false);
            }
        );

        return decoded;
    };

    const register = async (
        nickName,
        fullName,
        password
    ) => {
        const { data } =
            await authService.register(
                nickName,
                fullName,
                password
            );

        localStorage.setItem(
            'token',
            data.token
        );

        const decoded =
            decodeUser(data.token);

        setUser(decoded);

        setWebSocketConnected(false);

        connectWebSocket(
            data.token,

            () => {
                console.log(
                    'Register: WebSocket bağlantısı başarılı'
                );

                setWebSocketConnected(true);
            },

            (error) => {
                console.error(
                    'Register WebSocket hatası:',
                    error
                );

                setWebSocketConnected(false);
            }
        );

        return decoded;
    };

    const logout = () => {
        disconnectWebSocket();

        setWebSocketConnected(false);

        localStorage.removeItem('token');

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                webSocketConnected,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};