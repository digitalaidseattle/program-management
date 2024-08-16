
/**
 *  EpicPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { IconButton, Stack, TextField, Typography } from "@mui/material";
import { VentureProps } from "../../services/dasVentureService";
import { useContext, useEffect, useState } from "react";
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, } from "@ant-design/icons";
import { RefreshContext } from "../../components/contexts/RefreshContext";
import { dasAirtableService } from "../../services/airtableService";
import { projectService } from "../../services/projectService";

type EditBlockProps = {
    label: string,
    value: string,
    save: (text: string) => void
};


export const EditBlock: React.FC<EditBlockProps> = ({ label, value, save }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [text, setText] = useState<string>(value);

    const cancel = () => {
        setText(value);
        setEdit(false);
    }
    const doSave = () => {
        save(text)
        setEdit(false);
    }

    return (
        <>
            <Typography fontWeight={600}>{label}:
                {!edit &&
                    <IconButton size="small" color="primary" onClick={() => setEdit(!edit)}>
                        <EditOutlined />
                    </IconButton>
                }
                {edit &&
                    <>
                        <IconButton size="small" color="error" onClick={cancel}>
                            <CloseCircleOutlined />
                        </IconButton>
                        <IconButton size="small" color="success" onClick={doSave}>
                            <CheckCircleOutlined />
                        </IconButton>
                    </>
                }
            </Typography>
            {!edit && <Typography>{text}</Typography>}
            {edit && <TextField
                id="problem"
                name="problem"
                type="text"
                value={text}
                fullWidth
                variant="standard"
                multiline
                rows={4}
                onChange={(ev => setText(ev.target.value))}
            />}
        </>)
}

export const InfoPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setRefresh } = useContext(RefreshContext);

    // problem: fields['Problem (for DAS website)'],
    //                 solution: fields['Solution (for DAS website)'],
    //                 impact: fields['Impact (for DAS website)'],

    const saveProblem = (text: string) => {
        projectService.update(venture, { 'Problem (for DAS website)': text })
        .then(r => {
            console.log('saveProblem', r)
            setRefresh(0)

        })
    }
    const saveSolution = (text: string) => {
        alert(text)
        setRefresh(0)
    }
    const saveImpact = (text: string) => {
        alert(text)
        setRefresh(0)
    }

    return (
        <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
                <Typography fontWeight={600}>Partner: </Typography>
                <Typography> {venture.title}</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Typography fontWeight={600}>Status: </Typography>
                <Typography> {venture.status}</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Typography fontWeight={600}>Painpoint: </Typography>
                <Typography>{venture.painpoint}</Typography>
            </Stack>
            <EditBlock label="Problem" value={venture.problem} save={saveProblem} />
            <EditBlock label="Solution" value={venture.solution} save={saveSolution} />
            <EditBlock label="Impact" value={venture.impact} save={saveImpact} />
        </Stack>
    )
};
