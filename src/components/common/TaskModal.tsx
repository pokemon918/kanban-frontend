import {
    Backdrop,
    Fade,
    IconButton,
    Modal,
    Box,
    TextField,
    Typography,
    Divider,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Moment from 'moment';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import type { EventInfo } from '@ckeditor/ckeditor5-utils';
import taskApi from '../../api/taskApi';

import '../../css/custom-editor.css';

const modalStyle = {
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 1,
    height: '80%',
};

let timer: string | number | NodeJS.Timeout | undefined;
const timeout = 500;
let isModalClosed = false;

interface IProps {
    task: any;
    boardId: string;
    onClose: () => void;
    onUpdate: (task: any) => void;
    onDelete: (task: any) => void;
}

const TaskModal: React.FC<IProps> = ({
    task: pTask,
    boardId: pBoardId,
    onClose: pOnClose,
    onUpdate,
    onDelete,
}) => {
    const boardId = pBoardId;
    const [task, setTask] = useState(pTask);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const editorWrapperRef = useRef<HTMLDivElement>(null);

    const updateEditorHeight = () => {
        setTimeout(() => {
            const box = editorWrapperRef.current;
            if (box) {
                // eslint-disable-next-line prefer-const
                let editableElement = box.querySelector(
                    '.ck-editor__editable_inline'
                ) as HTMLElement;
                if (editableElement)
                    editableElement.style.height = `${box.offsetHeight - 50}px`;
            }
        }, timeout);
    };

    useEffect(() => {
        setTask(pTask);
        setTitle(pTask !== undefined ? pTask.title : '');
        setContent(pTask !== undefined ? pTask.content : '');
        if (pTask !== undefined) {
            isModalClosed = false;

            updateEditorHeight();
        }
    }, [pTask]);

    const onClose = () => {
        isModalClosed = true;
        onUpdate(task);
        pOnClose();
    };

    const deleteTask = async () => {
        try {
            await taskApi.delete(boardId, task.id);
            onDelete(task);
            setTask(undefined);
        } catch (err) {
            alert(err);
        }
    };

    const updateTitle = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        clearTimeout(timer);
        const newTitle = e.target.value;
        timer = setTimeout(async () => {
            try {
                await taskApi.update(boardId, task.id, { title: newTitle });
            } catch (err) {
                alert(err);
            }
        }, timeout);

        task.title = newTitle;
        setTitle(newTitle);
        onUpdate(task);
    };

    const updateContent = async (
        event: EventInfo<string, unknown>,
        editor: ClassicEditor
    ) => {
        clearTimeout(timer);
        const data = editor.getData();

        console.log({ isModalClosed });

        if (!isModalClosed) {
            timer = setTimeout(async () => {
                try {
                    await taskApi.update(boardId, task.id, { content: data });
                } catch (err) {
                    alert(err);
                }
            }, timeout);

            task.content = data;
            setContent(data);
            onUpdate(task);
        }
    };

    return (
        <Modal
            open={task !== undefined}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={task !== undefined}>
                <Box sx={modalStyle}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}
                    >
                        <IconButton color="error" onClick={deleteTask}>
                            <DeleteOutlinedIcon />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            height: '100%',
                            flexDirection: 'column',
                            padding: '2rem 5rem 5rem',
                        }}
                    >
                        <TextField
                            value={title}
                            onChange={updateTitle}
                            placeholder="Untitled"
                            variant="outlined"
                            fullWidth
                            sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-input': { padding: 0 },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'unset ',
                                },
                                '& .MuiOutlinedInput-root': {
                                    fontSize: '2.5rem',
                                    fontWeight: '700',
                                },
                                marginBottom: '10px',
                            }}
                        />
                        <Typography variant="body2" fontWeight="700">
                            {task !== undefined
                                ? Moment(task.createdAt).format('YYYY-MM-DD')
                                : ''}
                        </Typography>
                        <Divider sx={{ margin: '1.5rem 0' }} />
                        <Box
                            ref={editorWrapperRef}
                            sx={{
                                position: 'relative',
                                height: '80%',
                                overflowX: 'hidden',
                                overflowY: 'auto',
                            }}
                        >
                            <CKEditor
                                editor={ClassicEditor}
                                data={content}
                                onChange={updateContent}
                                onFocus={updateEditorHeight}
                                onBlur={updateEditorHeight}
                            />
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default TaskModal;
