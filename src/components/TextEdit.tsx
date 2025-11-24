/**
 *  TextEdit.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Box, ClickAwayListener, IconButton, Stack, TextField, Typography, useTheme } from "@mui/material";
import { ReactNode, useState } from "react";

export type TextEditProps = {
    value: string,
    rows?: number,
    itemRenderer?: ReactNode,
    onChange: (text: string) => void
};

export const TextEdit: React.FC<TextEditProps> = ({ itemRenderer, value, rows, onChange }) => {
    const theme = useTheme();
    const [edit, setEdit] = useState<boolean>(false);
    const [text, setText] = useState<string>(value);

    const cancel = () => {
        setText(value);
        setEdit(false);
    }

    const doSave = () => {
        onChange(text)
        setEdit(false);
    }

    return (
        <ClickAwayListener onClickAway={cancel}>
            <Stack direction={'row'}>
                {!edit &&
                    <>
                        <Box
                            sx={{
                                height: "100%",
                                width: "100%",
                                cursor: 'pointer',
                                '&': {
                                    '&:hover': {
                                        background: theme.palette.background.default,
                                        boxShadow:
                                            '0px 8px 8px 2px rgba(52, 61, 62, 0.1), 0px 8px 4px rgba(52, 61, 62, 0.1)',
                                    },
                                }
                            }}
                            onClick={() => setEdit(!edit)}>
                            {(itemRenderer !== undefined) ? itemRenderer : <Typography>{text}</Typography>}
                        </Box>
                    </>
                }
                {edit &&
                    <>
                        <TextField
                            id="problem"
                            name="problem"
                            type="text"
                            value={text}
                            variant="standard"
                            fullWidth={true}
                            multiline={rows && rows > 0 ? true : false}
                            rows={rows ?? 1}
                            onChange={(ev => setText(ev.target.value))}
                        />
                        <IconButton size="small" color="error" onClick={cancel}>
                            <CloseCircleOutlined />
                        </IconButton>
                        <IconButton size="small" color="success" onClick={doSave}>
                            <CheckCircleOutlined />
                        </IconButton>
                    </>
                }
            </Stack >
        </ClickAwayListener>
    );
}

