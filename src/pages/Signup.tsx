import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import authApi from '../api/authApi';

interface ISignupResponse {
    user: {
        _id: string;
        username: string;
        password: string;
        role: string;
        id: string;
        __v: number;
    };
    token: string;
}

const Signup: React.FC = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [usernameErrText, setUsernameErrText] = useState('');
    const [passwordErrText, setPasswordErrText] = useState('');
    const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('');

    const [role, setRole] = useState('worker');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRole((event.target as HTMLInputElement).value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUsernameErrText('');
        setPasswordErrText('');
        setConfirmPasswordErrText('');

        const data = new FormData(e.target as HTMLFormElement);
        const username = (data.get('username') as string).trim();
        const password = (data.get('password') as string).trim();
        const confirmPassword = (data.get('confirmPassword') as string).trim();

        let err = false;

        if (username === '') {
            err = true;
            setUsernameErrText('Please fill this field');
        }
        if (password === '') {
            err = true;
            setPasswordErrText('Please fill this field');
        }
        if (confirmPassword === '') {
            err = true;
            setConfirmPasswordErrText('Please fill this field');
        }
        if (password !== confirmPassword) {
            err = true;
            setConfirmPasswordErrText('Confirm password not match');
        }

        if (err) return;

        setLoading(true);

        try {
            const res = (await authApi.signup({
                username,
                password,
                confirmPassword,
                role,
            })) as unknown as ISignupResponse;
            setLoading(false);
            localStorage.setItem('token', res.token);
            navigate('/');
        } catch (err: any) {
            const errors = err?.data?.errors;
            errors.forEach(
                (e: { param?: string; path?: string; msg: string }) => {
                    if (e.param === 'username' || e.path === 'username') {
                        setUsernameErrText(e.msg);
                    }
                    if (e.param === 'password' || e.path === 'password') {
                        setPasswordErrText(e.msg);
                    }
                    if (
                        e.param === 'confirmPassword' ||
                        e.path === 'confirmPassword'
                    ) {
                        setConfirmPasswordErrText(e.msg);
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
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    disabled={loading}
                    error={confirmPasswordErrText !== ''}
                    helperText={confirmPasswordErrText}
                />
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">
                        Role
                    </FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={role}
                        onChange={handleChange}
                        row
                    >
                        <FormControlLabel
                            value="worker"
                            control={<Radio />}
                            label="Worker"
                        />
                        <FormControlLabel
                            value="master"
                            control={<Radio />}
                            label="Master"
                        />
                    </RadioGroup>
                </FormControl>
                <LoadingButton
                    sx={{ mt: 3, mb: 2 }}
                    variant="outlined"
                    fullWidth
                    color="success"
                    type="submit"
                    loading={loading}
                >
                    Signup
                </LoadingButton>
            </Box>
            <Button component={Link} to="/login" sx={{ textTransform: 'none' }}>
                Already have an account? Login
            </Button>
        </>
    );
};

export default Signup;
