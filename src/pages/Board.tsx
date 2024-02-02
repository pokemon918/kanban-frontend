import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import { Box, IconButton, TextField, Button } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import EmojiPicker from '../components/common/EmojiPicker';
import Kanban from '../components/common/Kanban';
import boardApi from '../api/boardApi';
import KanbanContext, { IBoard } from '../utils/contextData';

let timer: string | number | NodeJS.Timeout | undefined;
const timeout = 500;

const Board: React.FC = () => {
    const navigate = useNavigate();
    const { boardId } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sections, setSections] = useState<any[]>([]);
    const [isFavourite, setIsFavourite] = useState(false);
    const [isMine, setIsMine] = useState(false);
    const [icon, setIcon] = useState('');

    const contextData = useContext(KanbanContext);
    const user = contextData?.currentUser;
    const boards = useMemo(() => contextData?.boards || [], [contextData]);
    const setBoards = contextData?.setBoards;
    const favourites = useMemo(
        () => contextData?.favourites || [],
        [contextData]
    );
    const setFavourites = contextData?.setFavourites;

    const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([
        dayjs(new Date()),
        dayjs(new Date()),
    ]);

    useEffect(() => {
        const getBoard = async () => {
            try {
                const res = (await boardApi.getOne(
                    boardId || ''
                )) as unknown as IBoard;
                setTitle(res.title);
                setDateRange([dayjs(res.startDate), dayjs(res.endDate)]);
                setDescription(res.description);
                setSections(res.sections);
                setIsFavourite(res.favourite);
                setIcon(res.icon);
                setIsMine(res.user === user?.id);
            } catch (err) {
                console.log('error on getBoard: ', err);
            }
        };
        getBoard();
    }, [boardId, user?.id]);

    const onIconChange = async (newIcon: any) => {
        // eslint-disable-next-line prefer-const
        let temp = [...boards];
        const index = temp.findIndex((e) => e.id === boardId);
        temp[index] = { ...temp[index], icon: newIcon };

        if (isFavourite) {
            // eslint-disable-next-line prefer-const
            let tempFavourite = [...favourites];
            const favouriteIndex = tempFavourite.findIndex(
                (e) => e.id === boardId
            );
            tempFavourite[favouriteIndex] = {
                ...tempFavourite[favouriteIndex],
                icon: newIcon,
            };
            if (setFavourites) setFavourites(tempFavourite);
        }

        setIcon(newIcon);
        if (setBoards) setBoards(temp);
        try {
            await boardApi.update(boardId || '', { icon: newIcon });
        } catch (err) {
            alert(err);
        }
    };

    const updateTitle = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        clearTimeout(timer);
        const newTitle = e.target.value;
        setTitle(newTitle);

        // eslint-disable-next-line prefer-const
        let temp = [...boards];
        const index = temp.findIndex((e) => e.id === boardId);
        temp[index] = { ...temp[index], title: newTitle };

        if (isFavourite) {
            // eslint-disable-next-line prefer-const
            let tempFavourite = [...favourites];
            const favouriteIndex = tempFavourite.findIndex(
                (e) => e.id === boardId
            );
            tempFavourite[favouriteIndex] = {
                ...tempFavourite[favouriteIndex],
                title: newTitle,
            };
            if (setFavourites) setFavourites(tempFavourite);
        }

        if (setBoards) setBoards(temp);

        timer = setTimeout(async () => {
            try {
                await boardApi.update(boardId || '', { title: newTitle });
            } catch (err) {
                alert(err);
            }
        }, timeout);
    };

    const updateDescription = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        clearTimeout(timer);
        const newDescription = e.target.value;
        setDescription(newDescription);
        timer = setTimeout(async () => {
            try {
                await boardApi.update(boardId || '', {
                    description: newDescription,
                });
            } catch (err) {
                alert(err);
            }
        }, timeout);
    };

    const addFavourite = async () => {
        try {
            const board = (await boardApi.update(boardId || '', {
                favourite: !isFavourite,
            })) as unknown as IBoard;
            let newFavouriteList = [...favourites];
            if (isFavourite) {
                newFavouriteList = newFavouriteList.filter(
                    (e) => e.id !== boardId
                );
            } else {
                newFavouriteList.unshift(board);
            }
            if (setFavourites) setFavourites(newFavouriteList);
            setIsFavourite(!isFavourite);
        } catch (err) {
            alert(err);
        }
    };

    const deleteBoard = async () => {
        try {
            await boardApi.delete(boardId || '');
            if (isFavourite) {
                const newFavouriteList = favourites.filter(
                    (e) => e.id !== boardId
                );
                if (setFavourites) setFavourites(newFavouriteList);
            }

            const newList = boards.filter((e) => e.id !== boardId);
            if (newList.length === 0) {
                navigate('/boards');
            } else {
                navigate(`/boards/${newList[0].id}`);
            }
            if (setBoards) setBoards(newList);
        } catch (err) {
            console.log('error on deleteBoard: ', err);
        }
    };

    const updateDateRange = async (newValue: DateRange<Dayjs>) => {
        try {
            setDateRange(newValue);
            await boardApi.update(boardId || '', {
                startDate: newValue[0]?.toDate(),
                endDate: newValue[1]?.toDate(),
            });
        } catch (err) {
            alert(err);
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <IconButton onClick={addFavourite} disabled={!isMine}>
                    {isFavourite ? (
                        <StarOutlinedIcon color="warning" />
                    ) : (
                        <StarBorderOutlinedIcon />
                    )}
                </IconButton>
                {isMine ? (
                    <IconButton color="error" onClick={deleteBoard}>
                        <DeleteOutlinedIcon />
                    </IconButton>
                ) : null}
            </Box>
            <Box sx={{ padding: '10px 50px' }}>
                <Box>
                    {/* emoji picker */}
                    <EmojiPicker
                        icon={icon}
                        onChange={onIconChange}
                        editable={isMine}
                    />
                    <TextField
                        value={title}
                        onChange={updateTitle}
                        placeholder="Untitled"
                        variant="outlined"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-input': { padding: 0 },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'unset ',
                            },
                            '& .MuiOutlinedInput-root': {
                                fontSize: '2rem',
                                fontWeight: '700',
                            },
                        }}
                        disabled={!isMine}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateRangePicker
                            value={dateRange}
                            onChange={updateDateRange}
                            disabled={!isMine}
                        />
                    </LocalizationProvider>
                    <TextField
                        value={description}
                        onChange={updateDescription}
                        placeholder="Add a description"
                        variant="outlined"
                        multiline
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-input': { padding: 0 },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'unset ',
                            },
                            '& .MuiOutlinedInput-root': { fontSize: '0.8rem' },
                        }}
                        disabled={!isMine}
                    />
                </Box>
                <Box>
                    {/* Kanban board */}
                    <Kanban
                        data={sections}
                        boardId={boardId || ''}
                        editable={!!isMine}
                    />
                </Box>
            </Box>
        </>
    );
};

export default Board;
