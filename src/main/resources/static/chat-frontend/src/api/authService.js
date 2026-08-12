import axiosClient from './axiosClient';

export const register = (nickName, fullName, password) =>
    axiosClient.post('/api/v1/auth/register', { nickName, fullName, password });

export const login = (nickName, password) =>
    axiosClient.post('/api/v1/auth/authenticate', { nickName, password });