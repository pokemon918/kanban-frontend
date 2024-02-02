import { IBoards } from '../utils/contextData';
import axiosClient from './axiosClient';

const boardApi = {
    create: () => axiosClient.post('boards'),
    getAll: () => axiosClient.get('boards'),
    updatePosition: (params: { boards: IBoards[] }) =>
        axiosClient.put('boards', params),
    getOne: (id: string) => axiosClient.get(`boards/${id}`),
    delete: (id: string) => axiosClient.delete(`boards/${id}`),
    update: (id: string, params: any) =>
        axiosClient.put(`boards/${id}`, params),
    getFavourites: () => axiosClient.get('boards/favourites'),
    updateFavouritePosition: (params: { boards: IBoards[] }) =>
        axiosClient.put('boards/favourites', params),
};

export default boardApi;
