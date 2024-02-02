import axios, { AxiosRequestHeaders } from 'axios';
import queryString from 'query-string';

const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api/v1/';
export const getToken = () => window.localStorage.getItem('token');

const axiosClient = axios.create({
    baseURL: baseUrl,
    paramsSerializer: (params) => queryString.stringify({ params }),
});

axiosClient.interceptors.request.use(async (config) => {
    return {
        ...config,
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${getToken()}`,
        } as unknown as AxiosRequestHeaders,
    };
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) return response.data;
        return response;
    },
    (err) => {
        if (!err.response) {
            console.log('error axiosClient: ', err);
        }
        throw err.response;
    }
);

export default axiosClient;
