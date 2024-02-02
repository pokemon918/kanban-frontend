import axiosClient from './axiosClient';

const authApi = {
    signup: (params: {
        username: string;
        password: string;
        confirmPassword: string;
        role: string;
    }) => axiosClient.post('auth/signup', params),
    login: (params: { username: string; password: string }) =>
        axiosClient.post('auth/login', params),
    verifyToken: () => axiosClient.post('auth/verify-token'),
};

export default authApi;
