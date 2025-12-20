import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Card, CardContent, CardHeader, IconButton, TextField } from "@mui/material";
import { EntityProps } from "../../components/utils";
import { Meeting, meetingService } from "../../services/dasMeetingService";
import { useEffect, useState } from "react";
import { CARD_HEADER_SX } from "./utils";

export function NotesCard({ entity: meeting, onChange }: EntityProps<Meeting>) {
    const [notes, setNotes] = useState<string>();
    const [pristine, setPristine] = useState<boolean>(true);

    useEffect(() => {
        // allow updates only if not editing
        if (meeting && pristine) {
            setNotes(meeting.notes);
            setPristine(true);
        }
    }, [meeting]);

    function cancel(): void {
        setNotes(meeting.notes);
        setPristine(true);
    }

    function save(): void {
        meetingService.update(meeting.id, { notes: notes })
            .then(updated => {
                setPristine(true);
                onChange(updated);
            })
    }

    function handleChange(text: string): void {
        if (text !== notes) {
            setPristine(false);
            setNotes(text)
        }
    }

    return (
        <Card>
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title={'Notes'}
                action={!pristine && <>
                    <IconButton disabled={pristine} color="error" onClick={() => cancel()}><CloseCircleOutlined /></IconButton>
                    <IconButton disabled={pristine} color="success" onClick={() => save()}><CheckCircleOutlined /></IconButton>
                </>} />
            <CardContent>
                <TextField
                    value={notes}
                    sx={{
                        width: "100%",
                        '& .MuiInputBase-inputMultiline': { // Target the multiline input element
                            resize: 'both', // Allows both horizontal and vertical resizing
                            overflow: 'auto', // Ensures scrollbars appear if content exceeds visible area
                        }
                    }}
                    multiline={true}
                    rows={8}
                    onChange={(evt) => handleChange(evt.target.value)}
                />
            </CardContent>
        </Card>
    )
}
