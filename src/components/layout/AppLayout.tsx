import { Box } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loading from '../common/Loading';
import Sidebar from '../common/Sidebar';
import authUtils from '../../utils/authUtils';
import KanbanContext from '../../utils/contextData';

const AppLayout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const setCurrentUser = useContext(KanbanContext)?.setCurrentUser;

    useEffect(() => {
        const checkAuth = async () => {
            const user = await authUtils.isAuthenticated();
            if (!user) {
                navigate('/login');
            } else {
                // save user
                if (setCurrentUser) {
                    setCurrentUser(user);
                }
                setLoading(false);
            }
        };
        checkAuth();
    }, [navigate, setCurrentUser]);

    return loading ? (
        <Loading fullHeight />
    ) : (
        <Box
            sx={{
                display: 'flex',
            }}
        >
            <Sidebar />
            <Box
                sx={{
                    flexGrow: 1,
                    p: 1,
                    width: 'max-content',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default AppLayout;
