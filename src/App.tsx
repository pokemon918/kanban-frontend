import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './css/custom-scrollbar.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import AuthLayout from './components/layout/AuthLayout';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Board from './pages/Board';
import NotFound from './pages/NotFound';
import KanbanContext, { IBoards, IUserData } from './utils/contextData';
import { Toaster } from 'react-hot-toast';

export const App: React.FC = () => {
    const theme = createTheme({
        palette: { mode: 'dark' },
    });

    const [currentUser, setCurrentUser] = useState<IUserData | null>(null);
    const [boards, setBoards] = useState<IBoards[]>([]);
    const [favourites, setFavourites] = useState<IBoards[]>([]);

    const contextValue = useMemo(
        () => ({
            currentUser,
            setCurrentUser,
            boards,
            setBoards,
            favourites,
            setFavourites,
        }),
        [
            currentUser,
            setCurrentUser,
            boards,
            setBoards,
            favourites,
            setFavourites,
        ]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <KanbanContext.Provider value={contextValue}>
                <Routes>
                    <Route path="/" element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={<Home />} />
                        <Route path="boards" element={<Home />} />
                        <Route path="boards/:boardId" element={<Board />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
            </KanbanContext.Provider>
        </ThemeProvider>
    );
};

export const WrappedApp = () => {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
};
