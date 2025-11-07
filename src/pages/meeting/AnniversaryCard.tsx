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


function AnniversariesCard({ entity: meeting, onChange }: EntityProps<Meeting>) {
    const [anniversaries, setAnniversaries] = useState<MeetingTopic[]>([]);

    const notifications = useNotifications();

    useEffect(() => {
        if (meeting) {
            setAnniversaries((meeting.meeting_topic ?? []).filter(t => t.type === 'anniversary'))
        }
    }, [meeting]);

    async function addTopics(): Promise<void> {
        const cadre = await volunteerService.findCadreVolunteers();
        meetingTopicService.findIntros()
            .then(topics => {
                const start6 = dayjs(meeting.start_date).subtract(7, 'month');
                const end6 = dayjs(meeting.start_date).subtract(6, 'month');
                const sixMonthAnniversaries = cadre
                    .filter(v => !topics.find(t => t.subject_id.includes(v.id)))
                    .filter(v => dayjs(v.join_date).isAfter(start6) && dayjs(v.join_date).isBefore(end6))
                    .map(v => ({
                        ...meetingTopicService.empty(meeting.id),
                        type: 'anniversary' as const,
                        subject_id: [v.id],
                        subject: `${v.profile!.name}`,
                        message: `${v.profile!.name} joined ${v.join_date}!`,
                        source: 'Program Management Bot',
                    }));
                meetingTopicService.batchInsert(sixMonthAnniversaries)
                    .then(inserted => {
                        onChange(inserted);
                        notifications.success(`${inserted.length} anniversaries added`);
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
                <Tooltip title="Searches and creates intros for volunteers who have been with us for 6 months.">
                    <Button variant='outlined' color='primary' onClick={() => addTopics()} >
                        Add Anniversaries
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
                        {anniversaries.map(topic => (
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
export { AnniversariesCard };
