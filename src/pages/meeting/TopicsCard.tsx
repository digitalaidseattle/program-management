
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
import { useEffect, useState } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { InputOption } from '@digitalaidseattle/mui';
import InputFormDialog from '../../components/InputFormDialog';
import { EntityProps } from '../../components/utils';
import { Meeting, MeetingTopic, meetingTopicService } from '../../services/dasMeetingService';

function TopicsCard({ entity: meeting, onChange }: EntityProps<Meeting>) {

  const [topics, setTopics] = useState<MeetingTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<MeetingTopic>();
  const [isNew, setIsNew] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const inputFields: InputOption[] = [
    {
      name: "message",
      label: 'Title',
      type: 'string',
      disabled: false,
    },
    {
      name: "source",
      label: 'Team',
      type: 'string',
      disabled: false,
    }
  ]

  useEffect(() => {
    if (meeting) {
      setTopics((meeting.meeting_topic ?? []).filter(t => t.type === 'team'))
    }
  }, [meeting])

  function newTopic(): void {
    const topic = meetingTopicService.empty(meeting!.id);
    topic.type = 'team';
    setSelectedTopic(topic);
    setShowDialog(true);
    setIsNew(true);
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
        <Button variant='outlined' onClick={() => newTopic()}>New Topic</Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={'50px'}></TableCell>
              <TableCell width={'20%'}>Team/Person</TableCell>
              <TableCell>Message</TableCell>
              <TableCell width={'20%'}>Discussed</TableCell>
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
                <TableCell>{topic.source}</TableCell>
                <TableCell>{topic.message}</TableCell>
                <TableCell>{topic.discussed ? 'yes' : 'no'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <InputFormDialog
        open={showDialog}
        title={isNew ? 'Add topic' : 'Update topic'}
        inputFields={inputFields}
        entity={selectedTopic!}
        onChange={handleTopicChange} />
    </Card>
  );
}
export { TopicsCard };

