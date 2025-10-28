
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
import { InputOption } from '@digitalaidseattle/mui';
import InputFormDialog from '../../components/InputFormDialog';
import { EntityProps } from '../../components/utils';
import { Meeting, MeetingTopic, meetingTopicService } from '../../services/dasMeetingService';

function ShoutoutsCard({ entity: meeting, onChange }: EntityProps<Meeting>) {

  const [topics, setTopics] = useState<MeetingTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<MeetingTopic>();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { user } = useContext(UserContext);

  const inputFields: InputOption[] = [
    {
      name: "title",
      label: 'Who',
      type: 'string',
      disabled: false,
    },
    {
      name: "description",
      label: 'Why',
      type: 'string',
      disabled: false,
    },
    {
      name: "created_by",
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
    topic.created_by = user?.user_metadata!.name!;
    meetingTopicService.insert(topic)
      .then(inserted => {
        onChange(inserted);
        setSelectedTopic(inserted);
        setShowDialog(true);
      })
  }

  function deleteTopic(topic: MeetingTopic | null): void {
    if (topic) {
      meetingTopicService.delete(topic.id)
        .then(updated => onChange(updated))
    }
  }

  function handleTopicChange(topic: MeetingTopic | null): void {
    if (topic) {
      meetingTopicService.update(topic.id, topic)
        .then(updated => onChange(updated))
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
              <TableRow onDoubleClick={() => { setSelectedTopic(topic); setShowDialog(true) }} key={topic.id}>
                <TableCell>
                  <IconButton size={'small'} color='error' onClick={() => deleteTopic(topic)}>
                    <DeleteOutlined />
                  </IconButton>
                </TableCell>
                <TableCell>{topic.title}</TableCell>
                <TableCell>{topic.description}</TableCell>
                <TableCell>{topic.created_by}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <InputFormDialog
        open={showDialog}
        title={'Update the Shout Out'}
        inputFields={inputFields}
        entity={selectedTopic!}
        onChange={handleTopicChange} />
    </Card>
  );
}
export { ShoutoutsCard };
