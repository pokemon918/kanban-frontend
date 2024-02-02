import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    Typography,
} from '@mui/material';
import { useState, useContext, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AddBoxOutlined, LogoutOutlined } from '@mui/icons-material';
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
} from '@hello-pangea/dnd';
import { toast } from 'react-hot-toast';
import assets from '../../assets';
import FavouriteList from './FavouriteList';
import PublicList from './PublicList';
import KanbanContext, { IBoards } from '../../utils/contextData';
import boardApi from '../../api/boardApi';

const Sidebar: React.FC = () => {
    const contextData = useContext(KanbanContext);

    const user = contextData?.currentUser;
    const setCurrentUser = contextData?.setCurrentUser;

    const boards = useMemo(() => contextData?.boards || [], [contextData]);
    const setBoards = contextData?.setBoards;

    const navigate = useNavigate();
    const { boardId } = useParams();
    const [activeIndex, setActiveIndex] = useState(0);

    const sidebarWidth = 250;

    useEffect(() => {
        const getBoards = async () => {
            try {
                const res = (await boardApi.getAll()) as unknown as IBoards[];
                if (setBoards) setBoards(res);
            } catch (err) {
                console.log('error in getBoards: ', err);
            }
        };
        getBoards();
    }, [setBoards]);

    useEffect(() => {
        const activeItem = boards.findIndex((e) => e.id === boardId);
        if (boards.length > 0 && boardId === undefined) {
            navigate(`/boards/${boards[0].id}`);
        }
        setActiveIndex(activeItem);
    }, [boards, boardId, navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        if (setCurrentUser) setCurrentUser(null);
        navigate('/login');
    };

    const onDragEnd = async ({ source, destination }: DropResult) => {
        if (!destination || !source) {
            return;
        }
        const newList: IBoards[] = [...boards];
        const [removed] = newList.splice(source.index, 1);
        newList.splice(destination.index, 0, removed);

        const activeItem = newList.findIndex((e) => e.id === boardId);
        setActiveIndex(activeItem);
        if (setBoards) setBoards(newList);

        try {
            await boardApi.updatePosition({ boards: newList });
        } catch (err) {
            console.log('error in onDragEnd: ', err);
        }
    };

    const addBoard = async () => {
        try {
            const res = (await boardApi.create()) as unknown as IBoards;
            const newList = [res, ...boards];
            if (setBoards) setBoards(newList);
            navigate(`/boards/${res.id}`);
        } catch (err: any) {
            console.log('error on addboard: ', err);
            toast.error(err?.data?.message);
        }
    };

    return (
        <Drawer
            container={window.document.body}
            variant="permanent"
            open
            sx={{
                width: sidebarWidth,
                height: '100vh',
                '& > div': { borderRight: 'none' },
            }}
        >
            <List
                disablePadding
                sx={{
                    width: sidebarWidth,
                    height: '100vh',
                    backgroundColor: assets.colors.secondary,
                }}
            >
                <ListItem>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight="700"
                            color={
                                user?.role === 'master' ? '#66bb6a' : '#90caf9'
                            }
                        >
                            {user?.username}
                        </Typography>
                        <IconButton onClick={logout}>
                            <LogoutOutlined fontSize="small" />
                        </IconButton>
                    </Box>
                </ListItem>
                <Box sx={{ paddingTop: '10px' }} />
                <FavouriteList />
                <Box sx={{ paddingTop: '10px' }} />
                <ListItem>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="body2" fontWeight="700">
                            Private
                        </Typography>
                        {user?.role === 'master' ? (
                            <IconButton onClick={addBoard}>
                                <AddBoxOutlined fontSize="small" />
                            </IconButton>
                        ) : null}
                    </Box>
                </ListItem>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                        key="list-board-droppable-key"
                        droppableId="list-board-droppable"
                    >
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {boards &&
                                    boards.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                            isDragDisabled={
                                                user?.role !== 'master'
                                            }
                                        >
                                            {(provided, snapshot) => (
                                                <ListItemButton
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    selected={
                                                        index === activeIndex
                                                    }
                                                    component={Link}
                                                    to={`/boards/${item.id}`}
                                                    sx={{
                                                        pl: '20px',
                                                        cursor: snapshot.isDragging
                                                            ? 'grab'
                                                            : 'pointer!important',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight="700"
                                                        sx={{
                                                            whiteSpace:
                                                                'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow:
                                                                'ellipsis',
                                                        }}
                                                    >
                                                        {item.icon} {item.title}
                                                    </Typography>
                                                </ListItemButton>
                                            )}
                                        </Draggable>
                                    ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <Box sx={{ paddingTop: '10px' }} />
                <PublicList />
            </List>
        </Drawer>
    );
};

export default Sidebar;
