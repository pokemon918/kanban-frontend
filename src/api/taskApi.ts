import axiosClient from './axiosClient';

const taskApi = {
    create: (boardId: string, params: any) =>
        axiosClient.post(`boards/${boardId}/tasks`, params),
    updatePosition: (boardId: string, params: any) =>
        axiosClient.put(`boards/${boardId}/tasks/update-position`, params),
    delete: (boardId: string, taskId: string) =>
        axiosClient.delete(`boards/${boardId}/tasks/${taskId}`),
    update: (boardId: string, taskId: string, params: any) =>
        axiosClient.put(`boards/${boardId}/tasks/${taskId}`, params),
};

export default taskApi;
