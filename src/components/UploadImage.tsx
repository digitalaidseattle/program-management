/**
 *  UploadImage.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Box, ClickAwayListener, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import Logo from '../assets/images/project-image.png';


export const UploadImage = ({ url, onChange }: { url: string | undefined, onChange: (file: File[]) => void }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const newFile = acceptedFiles[0];
            setPicUrl(URL.createObjectURL(newFile));
            onChange(acceptedFiles);
        }
        setEdit(false);
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    const [picUrl, setPicUrl] = useState<string>("");

    useEffect(() => {
        setPicUrl(url ?? Logo)
    }, [url]);

    return (
        <ClickAwayListener onClickAway={() => setEdit(false)}>
            <Box
                sx={{ alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column" }}
                onClick={() => setEdit(!edit)}>
                <Box
                    sx={{
                        padding: 5,
                        height: "100%",
                        backgroundImage: `url(${picUrl})`,
                        backgroundSize: 'contain', // or 'contain'
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        inset: 0, // top:0, right:0, bottom:0, left:0
                        justifyContent: "center",
                        alignItems: "center",

                        backgroundColor: "rgba(255, 255, 255, 0.5)", // transparent white overlay
                        backdropFilter: "blur(2px)",                 // optional: subtle blur
                        zIndex: 1300,                                // above most content
                    }}
                    {...getRootProps()}>
                    <span><input disabled={!edit} {...getInputProps()} /></span>
                </Box>
                <Stack sx={{
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Typography fontWeight={600}>{edit ? "Drag the picture file here, or click to select the file." : 'Click to edit.'}</Typography>
                </Stack>
            </Box>
        </ClickAwayListener>
    );
}