/**
 *  UploadImage.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { useCallback, useState } from "react";
import { Box, ClickAwayListener, Stack, Tooltip, Typography } from "@mui/material";
import { useDropzone } from 'react-dropzone'
import { PictureOutlined } from '@ant-design/icons';



export const UploadImage = ({ url, onChange }: { url: string | undefined, onChange: (file: File[]) => void }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onChange(acceptedFiles);
        setEdit(false);
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    return (
        edit
            ? <ClickAwayListener onClickAway={() => setEdit(false)}>
                <Box
                    sx={{
                        padding: 5,
                        height: "100%",
                        position: "relative",
                        inset: 0, // top:0, right:0, bottom:0, left:0
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                        backgroundColor: "rgba(255, 255, 255, 0.5)", // transparent white overlay
                        backdropFilter: "blur(2px)",                 // optional: subtle blur
                        zIndex: 1300,                                // above most content
                    }}
                    {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Stack sx={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <PictureOutlined style={{ fontSize: '76px', }} size={200} />
                        <Typography fontWeight={600}>Drag the picture file here, or click to select the file.</Typography>
                    </Stack>
                </Box>
            </ClickAwayListener>
            : <Tooltip title={edit ? 'Drag the picture file here, or click to select the file' : 'Click to edit.'}>
                <Box
                    sx={
                        {
                            height: '100%',
                            backgroundImage: `url(${url})`,
                            backgroundSize: 'contain', // or 'contain'
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            inset: 0, // top:0, right:0, bottom:0, left:0
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }
                    }
                    onClick={() => setEdit(!edit)}>
                    {!url &&
                        <Stack sx={{
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <PictureOutlined style={{ fontSize: '76px', }} size={200} />
                            <Typography fontWeight={600}>Click to upload image.</Typography>
                        </Stack>}
                </Box>
            </Tooltip>
    );
}