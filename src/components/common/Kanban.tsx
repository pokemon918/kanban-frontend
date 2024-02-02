import {
    Box,
    Button,
    Typography,
    Divider,
    TextField,
    IconButton,
    Card,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
    DragDropContext,
    Draggable,
    Droppable,
    OnDragEndResponder,
} from '@hello-pangea/dnd';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import sectionApi from '../../api/sectionApi';
import taskApi from '../../api/taskApi';
import TaskModal from './TaskModal';

let timer: string | number | NodeJS.Timeout | undefined;
const timeout = 500;

interface IProps {
    data: any[];
    boardId: string;
    editable: boolean;
}

const Kanban: React.FC<IProps> = ({
    data: pData,
    boardId: pBoardId,
    editable,
}) => {
    const boardId = pBoardId;
    const [data, setData] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState(undefined);

    useEffect(() => {
        setData(pData);
    }, [pData]);

    const onDragEnd: OnDragEndResponder = async ({ source, destination }) => {
        if (!destination) return;
        const sourceColIndex = data.findIndex(
            (e) => e.id === source.droppableId
        );
        const destinationColIndex = data.findIndex(
            (e) => e.id === destination.droppableId
        );
        const sourceCol = data[sourceColIndex];
        const destinationCol = data[destinationColIndex];

        const sourceSectionId = sourceCol.id;
        const destinationSectionId = destinationCol.id;

        const sourceTasks = [...sourceCol.tasks];
        const destinationTasks = [...destinationCol.tasks];

        if (source.droppableId !== destination.droppableId) {
            const [removed] = sourceTasks.splice(source.index, 1);
            destinationTasks.splice(destination.index, 0, removed);
            data[sourceColIndex].tasks = sourceTasks;
            data[destinationColIndex].tasks = destinationTasks;
        } else {
            const [removed] = destinationTasks.splice(source.index, 1);
            destinationTasks.splice(destination.index, 0, removed);
            data[destinationColIndex].tasks = destinationTasks;
        }

        try {
            await taskApi.updatePosition(boardId, {
                resourceList: sourceTasks,
                destinationList: destinationTasks,
                resourceSectionId: sourceSectionId,
                destinationSectionId,
            });
            setData(data);
        } catch (err) {
            console.log('error on ondragEnd of task: ', err);
        }
    };

    const createSection = async () => {
        try {
            const section = await sectionApi.create(boardId);
            setData([...data, section]);
        } catch (err) {
            console.log('error on create section: ', err);
        }
    };

    const deleteSection = async (sectionId: string) => {
        try {
            await sectionApi.delete(boardId, sectionId);
            const newData = [...data].filter((e) => e.id !== sectionId);
            setData(newData);
        } catch (err) {
            console.log('error on delete section: ', err);
        }
    };

    const updateSectionTitle = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        sectionId: string
    ) => {
        clearTimeout(timer);
        const newTitle = e.target.value;
        const newData = [...data];
        const index = newData.findIndex((e) => e.id === sectionId);
        newData[index].title = newTitle;
        setData(newData);
        timer = setTimeout(async () => {
            try {
                await sectionApi.update(boardId, sectionId, {
                    title: newTitle,
                });
            } catch (err) {
                console.log('error on update title: ', err);
            }
        }, timeout);
    };

    const createTask = async (sectionId: string) => {
        try {
            const task = await taskApi.create(boardId, { sectionId });
            const newData = [...data];
            const index = newData.findIndex((e) => e.id === sectionId);
            newData[index].tasks.unshift(task);
            setData(newData);
        } catch (err) {
            alert(err);
        }
    };

    const onUpdateTask = (task: any) => {
        const newData = [...data];
        const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
        const taskIndex = newData[sectionIndex].tasks.findIndex(
            (e: any) => e.id === task.id
        );
        newData[sectionIndex].tasks[taskIndex] = task;
        setData(newData);
    };

    const onDeleteTask = (task: any) => {
        const newData = [...data];
        const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
        const taskIndex = newData[sectionIndex].tasks.findIndex(
            (e: any) => e.id === task.id
        );
        newData[sectionIndex].tasks.splice(taskIndex, 1);
        setData(newData);
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {editable ? (
                    <Button onClick={createSection}>Add section</Button>
                ) : null}
                <Typography variant="body2" fontWeight="700">
                    {data.length} Sections
                </Typography>
            </Box>
            <Divider sx={{ margin: '10px 0' }} />
            <DragDropContext onDragEnd={onDragEnd}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        width: 'calc(100vw - 400px)',
                        overflowX: 'auto',
                    }}
                >
                    {data.map((section, key) => (
                        <>
                            <div key={section.id} style={{ width: '300px' }}>
                                <Droppable
                                    key={section.id}
                                    droppableId={section.id}
                                >
                                    {(provided) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            sx={{
                                                width: '300px',
                                                padding: '10px',
                                                marginRight: '10px',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                    marginBottom: '10px',
                                                }}
                                            >
                                                <TextField
                                                    value={section.title}
                                                    onChange={(e) =>
                                                        updateSectionTitle(
                                                            e,
                                                            section.id
                                                        )
                                                    }
                                                    placeholder="Untitled"
                                                    variant="outlined"
                                                    sx={{
                                                        flexGrow: 1,
                                                        '& .MuiOutlinedInput-input':
                                                            { padding: 0 },
                                                        '& .MuiOutlinedInput-notchedOutline':
                                                            {
                                                                border: 'unset ',
                                                            },
                                                        '& .MuiOutlinedInput-root':
                                                            {
                                                                fontSize:
                                                                    '1rem',
                                                                fontWeight:
                                                                    '700',
                                                            },
                                                    }}
                                                    disabled={!editable}
                                                />
                                                {editable ? (
                                                    <>
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                color: 'gray',
                                                                '&:hover': {
                                                                    color: 'green',
                                                                },
                                                            }}
                                                            onClick={() =>
                                                                createTask(
                                                                    section.id
                                                                )
                                                            }
                                                        >
                                                            <AddOutlinedIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                color: 'gray',
                                                                '&:hover': {
                                                                    color: 'red',
                                                                },
                                                            }}
                                                            onClick={() =>
                                                                deleteSection(
                                                                    section.id
                                                                )
                                                            }
                                                        >
                                                            <DeleteOutlinedIcon />
                                                        </IconButton>
                                                    </>
                                                ) : null}
                                            </Box>
                                            {/* tasks */}
                                            {section.tasks.map(
                                                (task: any, index: number) => (
                                                    <Draggable
                                                        key={task.id}
                                                        draggableId={task.id}
                                                        index={index}
                                                    >
                                                        {(
                                                            provided,
                                                            snapshot
                                                        ) => (
                                                            <Card
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                sx={{
                                                                    padding:
                                                                        '10px',
                                                                    marginBottom:
                                                                        '10px',
                                                                    cursor: snapshot.isDragging
                                                                        ? 'grab'
                                                                        : 'pointer!important',
                                                                }}
                                                                onClick={() =>
                                                                    setSelectedTask(
                                                                        task
                                                                    )
                                                                }
                                                            >
                                                                <Typography>
                                                                    {task.title ===
                                                                    ''
                                                                        ? 'Untitled'
                                                                        : task.title}
                                                                </Typography>
                                                            </Card>
                                                        )}
                                                    </Draggable>
                                                )
                                            )}
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                            </div>
                            {key < data.length - 1 ? (
                                <Divider
                                    orientation="vertical"
                                    sx={{ margin: '0 10px', height: '300px' }}
                                />
                            ) : null}
                        </>
                    ))}
                </Box>
            </DragDropContext>
            <TaskModal
                task={selectedTask}
                boardId={boardId}
                onClose={() => setSelectedTask(undefined)}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
            />
        </>
    );
};

export default Kanban;
