import {
    Button,
    Card,
    CardContent,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip
} from '@mui/material';

import dayjs from 'dayjs';
import { EntityProps } from '../../components/utils';
import { Meeting, MeetingTopic, meetingTopicService } from '../../services/dasMeetingService';
import { volunteerService } from '../../services/dasVolunteerService';
import { } from 'airtable';
import { useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { useNotifications } from '@digitalaidseattle/core';


function IntrosCard({ entity: meeting, onChange }: EntityProps<Meeting>) {
    const [intros, setIntros] = useState<MeetingTopic[]>([]);

    const notifications = useNotifications();

    useEffect(() => {
        if (meeting) {
            setIntros((meeting.meeting_topic ?? []).filter(t => t.type === 'intro'))
        }
    }, [meeting]);

    async function addIntros(): Promise<void> {
        const cutoff = dayjs(meeting.date).subtract(2, 'month');
        const cadre = await volunteerService.findCadreVolunteers();
        meetingTopicService.findIntros()
            .then(topics => {
                const newIntros = cadre
                    .filter(v => !topics.find(t => t.subject_id.includes(v.id)))
                    .filter(v => dayjs(v.join_date).isAfter(cutoff))
                    .map(v => ({
                        ...meetingTopicService.empty(meeting.id),
                        type: 'intro' as const,
                        subject_id: [v.id],
                        subject: `${v.profile!.name}`,
                        message: `Welcome ${v.profile!.name}`,
                        source: 'Program Management Bot',
                    }));
                meetingTopicService.batchInsert(newIntros)
                    .then(inserted => {
                        onChange(inserted);
                        notifications.success(`${inserted.length} intros added`);
                    })
            })
    }

    function deleteTopic(topic: MeetingTopic | null): void {
        if (topic) {
            meetingTopicService.delete(topic.id)
                .then(updated => onChange(updated))
        }
    }
    return (
        <Card>
            <CardContent>
                <Tooltip title="Searches and creates intros for new volunteers who joined in the last two months">
                    <Button variant='outlined' color='primary' onClick={() => addIntros()} >
                        Add Intros
                    </Button>
                </Tooltip>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={'50px'}></TableCell>
                            <TableCell width={'20%'} >Who</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Discussed</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {intros.map(topic => (
                            <TableRow key={topic.id}>
                                <TableCell>
                                    <IconButton size={'small'} color='error' onClick={() => deleteTopic(topic)}>
                                        <DeleteOutlined />
                                    </IconButton>
                                </TableCell>
                                <TableCell>{topic.subject}</TableCell>
                                <TableCell>{topic.message}</TableCell>
                                <TableCell>{topic.discussed ? 'yes' : 'no'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent >
        </Card >
    );
}
export { IntrosCard };
