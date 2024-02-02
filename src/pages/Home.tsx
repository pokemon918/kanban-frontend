import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import KanbanContext, { IBoard } from '../utils/contextData';
import boardApi from '../api/boardApi';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const contextData = useContext(KanbanContext);
    const setBoards = contextData?.setBoards;

    const createBoard = async () => {
        setLoading(true);
        try {
            const res = (await boardApi.create()) as unknown as IBoard;
            if (setBoards) setBoards([res]);
            navigate(`/boards/${res.id}`);
        } catch (err: any) {
            console.log('error create board: ', err);
            toast.error(err?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <LoadingButton
                variant="outlined"
                color="success"
                onClick={createBoard}
                loading={loading}
            >
                Click here to create your first board
            </LoadingButton>
        </Box>
    );
};

export default Home;
