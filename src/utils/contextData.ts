import React from 'react';

export interface IUserData {
    id: string;
    username: string;
    role: string;
    __v: number;
    _id: string;
}

export interface IBoards {
    _id: string;
    user: string;
    icon: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
    position: number;
    favourite: boolean;
    favouritePosition: number;
    __v: number;
    id: string;
}

export interface IBoard extends IBoards {
    sections: any[];
}

interface IKanbanContext {
    currentUser: IUserData | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<IUserData | null>>;
    boards: IBoards[];
    setBoards: React.Dispatch<React.SetStateAction<IBoards[]>>;
    favourites: IBoards[];
    setFavourites: React.Dispatch<React.SetStateAction<IBoards[]>>;
}

const KanbanContext = React.createContext<IKanbanContext | null>(null);

export default KanbanContext;
