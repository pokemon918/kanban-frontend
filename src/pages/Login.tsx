import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import authApi from '../api/authApi';

interface ILoginResponse {
    user: {
        _id: string;
        username: string;
        role: string;
        id: string;
    };
    token: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [usernameErrText, setUsernameErrText] = useState('');
    const [passwordErrText, setPasswordErrText] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUsernameErrText('');
        setPasswordErrText('');

        const data = new FormData(e.target as HTMLFormElement);
        const username = (data.get('username') as string).trim();
        const password = (data.get('password') as string).trim();

        let err = false;

        if (username === '') {
            err = true;
            setUsernameErrText('Please fill this field');
        }
        if (password === '') {
            err = true;
            setPasswordErrText('Please fill this field');
        }

        if (err) return;

        setLoading(true);

        try {
            const res = (await authApi.login({
                username,
                password,
            })) as unknown as ILoginResponse;
            setLoading(false);
            localStorage.setItem('token', res.token);
            navigate('/');
        } catch (err: any) {
            const errors = err?.data?.errors;
            console.log('error: ', err);
            errors.forEach(
                (e: { path?: string; param?: string; msg: string }) => {
                    if (e.path === 'username' || e.param === 'username') {
                        setUsernameErrText(e.msg);
                    }
                    if (e.path === 'password' || e.param === 'password') {
                        setPasswordErrText(e.msg);
                    }
                }
            );
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                component="form"
                sx={{ mt: 1 }}
                onSubmit={handleSubmit}
                noValidate
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    disabled={loading}
                    error={usernameErrText !== ''}
                    helperText={usernameErrText}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    disabled={loading}
                    error={passwordErrText !== ''}
                    helperText={passwordErrText}
                />
                <LoadingButton
                    sx={{ mt: 3, mb: 2 }}
                    variant="outlined"
                    fullWidth
                    color="success"
                    type="submit"
                    loading={loading}
                >
                    Login
                </LoadingButton>
            </Box>
            <Button
                component={Link}
                to="/signup"
                sx={{ textTransform: 'none' }}
            >
                Don't have an account? Signup
            </Button>
        </>
    );
};

export default Login;
