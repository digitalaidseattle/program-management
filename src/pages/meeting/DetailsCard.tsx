/*
 * DetailsCard.tsx
 * @Copyright 2025 Digital Aid Seattle
 */
import {
    Card,
    CardContent,
    FormControl,
    Stack,
    TextField
} from '@mui/material';
import { DateTimePicker } from "@mui/x-date-pickers";
import { useContext, useEffect, useState } from 'react';

import { UserContext } from '@digitalaidseattle/core';
import dayjs from 'dayjs';
import { EntityProps } from '../../components/utils';
import { Meeting, meetingService, MeetingTopic, meetingTopicService } from '../../services/dasMeetingService';

const DetailsCard: React.FC<EntityProps<Meeting>> = ({ entity: meeting, onChange }) => {
    const [iceBreakerTopic, setIceBreaker] = useState<MeetingTopic>();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (meeting) {
            setIceBreaker((meeting.meeting_topic ?? []).find(t => t.type === 'icebreaker'))
        }
    }, [meeting])

    function handleIcebreakerChange(field: keyof MeetingTopic, message: string): void {
        if (iceBreakerTopic) {
            const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(message)} }`)
            setIceBreaker({ ...iceBreakerTopic, ...changes });
            meetingTopicService.update(iceBreakerTopic.id, changes)
                .then(updated => onChange(updated))
        } else {
            const topic = meetingTopicService.empty(meeting.id);
            topic.type = 'icebreaker';
            topic.message = message;
            topic.source = user?.email!;
            setIceBreaker(topic);
            meetingTopicService.insert(topic)
                .then(inserted => onChange(inserted))
        }
    }

    function handleMeetingChange(field: keyof Meeting, value: any): void {
        const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
        meetingService.update(meeting.id, changes)
            .then(updated => onChange(updated))
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Stack gap={2}>
                        <FormControl fullWidth >
                            <TextField
                                id={'name'}
                                name={'name'}
                                type="text"
                                label={'Name'}
                                rows={1}
                                value={meeting.name}
                                fullWidth
                                variant="outlined"
                                onChange={(evt) => handleMeetingChange('name', evt.target.value)}
                            />
                        </FormControl>
                        <DateTimePicker
                            label='Meeting Date'
                            value={dayjs(meeting.date)}
                            onChange={(value) => handleMeetingChange('date', value!.toDate())} />
                        {meeting.type === 'plenary' &&
                            <FormControl fullWidth >
                                <TextField
                                    id={'icebreaker'}
                                    name={'icebreaker'}
                                    type="text"
                                    label={'Ice Breaker'}
                                    rows={1}
                                    value={iceBreakerTopic ? iceBreakerTopic.message : ''}
                                    fullWidth
                                    variant="outlined"
                                    onChange={(evt) => handleIcebreakerChange('message', evt.target.value)}
                                />
                            </FormControl>
                        }
                    </Stack>
                </CardContent>
            </Card>
        </>);
}

export { DetailsCard };
