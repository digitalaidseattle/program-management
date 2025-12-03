import {
    Card,
    CardContent, CardHeader,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@mui/material";
import { useEffect, useState } from "react";
import { Meeting, MeetingTopic, meetingTopicService } from "../../services/dasMeetingService";

import { EntityProps } from "../../components/utils";

import { PlusCircleOutlined } from "@ant-design/icons";
import { CARD_HEADER_SX } from "./utils";

export function TopicsCard({ entity: meeting, onChange }: EntityProps<Meeting>) {
    const [topics, setTopics] = useState<MeetingTopic[]>([]);

    useEffect(() => {
        if (meeting) {
            setTopics(meeting.meeting_topic!);
        }
    }, [meeting]);

    function markAsDiscussed(topic: MeetingTopic) {
        meetingTopicService.update(topic.id!, { discussed: true })
            .then((updated) => onChange(updated))
    }

    function addTopic() {
        const newTopic = meetingTopicService.empty(meeting.id);
        meetingTopicService.insert(newTopic)
            .then((updated) => onChange(updated))
    }

    return (meeting &&
        <Card >
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title={'Topics'}
                action={
                    <IconButton onClick={() => addTopic()}>
                        <PlusCircleOutlined />
                    </IconButton>} />
            <CardContent sx={{ padding: 0 }}>
                <Table >
                    <TableBody>
                        {topics.map((topic, idx) => (
                            <TableRow key={idx}>
                                <TableCell width={25}><Checkbox checked={topic.discussed}
                                    onClick={() => markAsDiscussed(topic)} /></TableCell>
                                <TableCell>{topic.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>)
}
