import { Container, Box } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../common/Loading';
import assets from '../../assets';
import authUtils from '../../utils/authUtils';

const AuthLayout: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await authUtils.isAuthenticated();
            if (!isAuth) setLoading(false);
            else navigate('/');
        };
        checkAuth();
    }, [navigate]);

    return loading ? (
        <Loading fullHeight />
    ) : (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <img
                    src={assets.images.logoDark}
                    style={{ width: '100px' }}
                    alt="app logo"
                />
                <Outlet />
            </Box>
        </Container>
    );
};

export default AuthLayout;
