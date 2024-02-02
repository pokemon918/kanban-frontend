import { Box, ListItem, ListItemButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { IBoards } from '../../utils/contextData';

const PublicList: React.FC = () => {
    const list: IBoards[] = [];

    const [activeIndex, setActiveIndex] = useState(0);

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
                        Public
                    </Typography>
                </Box>
            </ListItem>
            <DragDropContext onDragEnd={() => alert('on drag end')}>
                <Droppable
                    key="list-board-droppable-key"
                    droppableId="list-board-droppable"
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {list.map((item, index) => (
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

export default PublicList;
