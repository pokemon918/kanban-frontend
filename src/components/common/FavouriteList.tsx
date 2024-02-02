import { Box, ListItem, ListItemButton, Typography } from '@mui/material';
import { useEffect, useState, useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
} from '@hello-pangea/dnd';
import KanbanContext, { IBoards } from '../../utils/contextData';
import boardApi from '../../api/boardApi';

const FavouriteList: React.FC = () => {
    const contextData = useContext(KanbanContext);
    const boards = useMemo(() => contextData?.boards || [], [contextData]);
    const favourites = useMemo(
        () => contextData?.favourites || [],
        [contextData]
    );
    const setFavourites = contextData?.setFavourites;

    const [activeIndex, setActiveIndex] = useState(0);
    const { boardId } = useParams();

    useEffect(() => {
        const getBoards = async () => {
            try {
                const res =
                    (await boardApi.getFavourites()) as unknown as IBoards[];
                if (setFavourites) setFavourites(res);
            } catch (err) {
                console.log('error on getFavourites: ', err);
            }
        };
        getBoards();
    }, [boards, setFavourites]);

    useEffect(() => {
        const index = favourites.findIndex((e) => e.id === boardId);
        setActiveIndex(index);
    }, [favourites, boardId]);

    const onDragEnd = async ({ source, destination }: DropResult) => {
        if (!destination || !source) {
            return;
        }
        const newList = [...favourites];
        const [removed] = newList.splice(source.index, 1);
        newList.splice(destination.index, 0, removed);

        const activeItem = newList.findIndex((e) => e.id === boardId);
        setActiveIndex(activeItem);

        if (setFavourites) setFavourites(newList);

        try {
            await boardApi.updateFavouritePosition({ boards: newList });
        } catch (err) {
            console.log('error in onDragEnd(favourite)', err);
        }
    };

    return (
        <>
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
                        Favourites
                    </Typography>
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
                            {favourites.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <ListItemButton
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                            selected={index === activeIndex}
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
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
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
        </>
    );
};

export default FavouriteList;
