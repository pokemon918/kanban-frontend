import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Picker } from 'emoji-mart';

import 'emoji-mart/css/emoji-mart.css';

interface IProps {
    icon: string;
    onChange: (newIcon: unknown) => Promise<void>;
    editable: boolean;
}

const EmojiPicker: React.FC<IProps> = ({ icon, onChange, editable }) => {
    const [selectedEmoji, setSelectedEmoji] = useState<string>();
    const [isShowPicker, setIsShowPicker] = useState(false);

    useEffect(() => {
        setSelectedEmoji(icon);
    }, [icon]);

    const selectEmoji = (e: any) => {
        console.log('select emoji: ', e);
        const sym = e.unified.split('-');
        const codesArray = sym.map((el: unknown) => `0x${el}`);
        const emoji = String.fromCodePoint(...codesArray);
        setIsShowPicker(false);
        onChange(emoji);
    };

    const showPicker = () => (editable ? setIsShowPicker(!isShowPicker) : null);

    return (
        <Box sx={{ position: 'relative', width: 'max-content' }}>
            <Typography
                variant="h3"
                fontWeight="700"
                sx={{ cursor: 'pointer' }}
                onClick={showPicker}
            >
                {selectedEmoji}
            </Typography>
            <Box
                sx={{
                    display: isShowPicker ? 'block' : 'none',
                    position: 'absolute',
                    top: '100%',
                    zIndex: '9999',
                }}
            >
                <Picker
                    theme="dark"
                    onSelect={selectEmoji}
                    showPreview={false}
                />
            </Box>
        </Box>
    );
};

export default EmojiPicker;
