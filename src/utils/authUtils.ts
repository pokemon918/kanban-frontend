import authApi from '../api/authApi';
import { getToken } from '../api/axiosClient';

interface IResponse {
    user: {
        id: string;
        username: string;
        __v: number;
        _id: string;
    };
}

export default {
    isAuthenticated: async () => {
        const token = getToken();
        if (!token) return false;
        try {
            const res = (await authApi.verifyToken()) as unknown as IResponse;
            return res.user;
        } catch {
            return false;
        }
    },
};
