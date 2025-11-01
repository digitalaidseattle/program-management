
// material-ui
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { UserContext } from '@digitalaidseattle/core';
import { InputFormDialog, InputOption } from '@digitalaidseattle/mui';
import { EntityProps } from '../../components/utils';
import { Meeting, MeetingTopic, meetingTopicService } from '../../services/dasMeetingService';

function ShoutoutsCard({ entity: meeting, onChange }: EntityProps<Meeting>) {

  const [topics, setTopics] = useState<MeetingTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<MeetingTopic>();
  const [isNew, setIsNew] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { user } = useContext(UserContext);

  const inputFields: InputOption[] = [
    {
      name: "subject",
      label: 'Who',
      type: 'string',
      disabled: false,
    },
    {
      name: "message",
      label: 'Why',
      type: 'string',
      disabled: false,
    },
    {
      name: "source",
      label: 'From',
      type: 'string',
      disabled: false,
    }
  ]

  useEffect(() => {
    if (meeting) {
      setTopics((meeting.meeting_topic ?? []).filter(t => t.type === 'shoutout'))
    }
  }, [meeting])

  function newTopic(): void {
    const topic = meetingTopicService.empty(meeting!.id);
    topic.type = 'shoutout';
    topic.source = user?.user_metadata!.name!;
    setSelectedTopic(topic);
    setIsNew(true);
    setShowDialog(true);
  }

  function deleteTopic(topic: MeetingTopic | null): void {
    if (topic) {
      meetingTopicService.delete(topic.id)
        .then(updated => onChange(updated))
    }
  }

  function handleTopicChange(topic: MeetingTopic | null): void {
    if (topic) {
      if (isNew) {
        meetingTopicService.insert(topic)
          .then(inserted => onChange(inserted))
      } else {
        meetingTopicService.update(topic.id, topic)
          .then(updated => onChange(updated))
      }
    }
    setShowDialog(false);
    setSelectedTopic(undefined);
  }

  return (
    <Card>
      <CardContent>
        <Button variant='outlined' onClick={() => newTopic()}>Add Shout Out</Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={'50px'}></TableCell>
              <TableCell width={'20%'}>Who</TableCell>
              <TableCell>Why</TableCell>
              <TableCell width={'20%'}>From</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topics.map(topic => (
              <TableRow onDoubleClick={() => { setSelectedTopic(topic); setIsNew(false); setShowDialog(true) }} key={topic.id}>
                <TableCell>
                  <IconButton size={'small'} color='error' onClick={() => deleteTopic(topic)}>
                    <DeleteOutlined />
                  </IconButton>
                </TableCell>
                <TableCell>{topic.subject}</TableCell>
                <TableCell>{topic.message}</TableCell>
                <TableCell>{topic.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <InputFormDialog
        open={showDialog}
        title={isNew ? 'Add a Shout Out' : 'Update the Shout Out'}
        inputFields={inputFields}
        entity={selectedTopic!}
        onChange={handleTopicChange}
      />
    </Card>
  );
}
export { ShoutoutsCard };
