

/**
 *  EpicPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Box, IconButton, Stack, TextField, Typography, useTheme } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";

export type EditTextProps = {
    header?: ReactNode;
    display: ReactNode,
    value: string,
    multiline?: boolean,
    onChange: (text: string) => void
};

export const EditField: React.FC<EditTextProps> = ({ header, display, value, multiline = false, onChange }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [text, setText] = useState<string>(value);

    const theme = useTheme();

    useEffect(() => {
        setText(value)
    }, [value]);

    const cancel = () => {
        setText(value);
        setEdit(false);
    }
    const doSave = () => {
        onChange(text)
        setEdit(false);
    }

    function renderWithHeader(): ReactNode {
        return (
            edit
                ? (
                    <Stack width={'100%'}>
                        <Box>
                            {typeof header === 'string'
                                ? <Typography sx={{ fontWeight: 600, fontSize: 20 }}>{header}</Typography>
                                : header}
                            <IconButton size="small" color="error" onClick={cancel}>
                                <CloseCircleOutlined />
                            </IconButton>
                            <IconButton size="small" color="success" onClick={doSave}>
                                <CheckCircleOutlined />
                            </IconButton>
                        </Box>
                        <TextField
                            type="text"
                            value={text}
                            fullWidth
                            variant="standard"
                            multiline={multiline}
                            onChange={(ev => setText(ev.target.value))}
                        />
                    </Stack>
                )
                : (
                    <Box>
                        <Box sx={{
                            width: "100%",
                            cursor: 'pointer',
                            '&': {
                                '&:hover': {
                                    background: theme.palette.background.default,
                                    boxShadow:
                                        '0px 8px 8px 2px rgba(52, 61, 62, 0.1), 0px 8px 4px rgba(52, 61, 62, 0.1)',
                                },
                            },
                        }} onDoubleClick={() => setEdit(true)} >
                            {typeof header === 'string'
                                ? <Typography sx={{ fontWeight: 600, fontSize: 20 }}>{header}</Typography>
                                : header
                            }
                        </Box>
                        {display}
                    </Box>
                )
        )
    }

    function render(): ReactNode {
        return (
            edit
                ? (
                    <>
                        <TextField
                            id="x"
                            type="text"
                            value={text}
                            fullWidth
                            variant="standard"
                            multiline={multiline}
                            onChange={(ev => setText(ev.target.value))}
                        />
                        <IconButton size="small" color="error" onClick={cancel}>
                            <CloseCircleOutlined />
                        </IconButton>
                        <IconButton size="small" color="success" onClick={doSave}>
                            <CheckCircleOutlined />
                        </IconButton>
                    </>
                )
                : (
                    <Box sx={{
                        width: "100%",
                        cursor: 'pointer',
                        '&': {
                            '&:hover': {
                                background: theme.palette.background.default,
                                boxShadow:
                                    '0px 8px 8px 2px rgba(52, 61, 62, 0.1), 0px 8px 4px rgba(52, 61, 62, 0.1)',
                            },
                        },
                    }} onDoubleClick={() => setEdit(true)} >
                        {display}
                    </Box>
                )
        )
    }

    return (
        <Stack direction={'row'}>
            {header ? renderWithHeader() : render()}
        </Stack>)
}
