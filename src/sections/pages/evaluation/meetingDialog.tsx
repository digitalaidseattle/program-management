/**
 *  meetingDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { FieldSet, Record } from "airtable";
import { dasAttendanceService, dasMeetingService, DASMeetingService, Meeting } from "../../evaluation/api/dasMeetingService";
import useVolunteers from "../../evaluation/components/useVolunteers";
import AirtableRecordDialog from "../../../components/DASAirtableRecordDialog";

const MeetingDialog: React.FC<EntityDialogProps<Meeting>> = ({ open, entity, handleSuccess, handleError }) => {

    const { data: volunteers } = useVolunteers();

    const fields =
    {
        "Topics": entity.topics,
        "type": entity.type,
        "Created via": entity.createdVia,
        "Meeting purpose": entity.purpose,
        "Meeting duration in minutes": entity.duration,
        "Start Date/Time": entity.startDateTime,
        "Team": entity.teamIds,
        "Task Group discussed": entity.taskGroupIds,
        "volunteerIds": entity.attendances.map(att => att.internalAttendeeIds).flat()
    }

    const inputs = [
        {
            name: "type",
            label: 'Type',
            fieldName: "type",
            type: 'select',
            options: DASMeetingService.TYPES
        }, {
            name: "createdVia",
            label: 'Created Via',
            fieldName: "Created via",
            type: 'select',
            options: DASMeetingService.CREATION_TYPES
        },
        {
            name: "date",
            label: 'Date',
            fieldName: "Start Date/Time",
            type: 'date'
        },
        {
            name: "time",
            label: 'Time',
            fieldName: "Start Date/Time",
            type: 'time'
        },
        {
            name: "meetingDuration",
            label: 'Meeting length',
            fieldName: "Meeting duration in minutes",
            type: 'select',
            options: DASMeetingService.DURATIONS
        },
        {
            name: "purpose",
            label: 'Purpose',
            fieldName: "Meeting purpose",
            type: 'text'
        },
        {
            name: "topics",
            label: 'Topics',
            fieldName: "Topics",
            type: 'text'
        },
        {
            name: "attendees",
            fieldName: "volunteerIds",
            label: 'Attendees',
            placeholder: "DAS Member",
            type: 'lookup',
            options: volunteers
        }
    ]

    const handleSubmit = (changes: any) => {
        if (entity && entity.id) {
            dasMeetingService
                .update({
                    id: entity?.id,
                    fields: changes
                })
                .then(res => handleSuccess(res))
                .catch(e => handleError(e))
        } else {
            const volunteerIds =  fields['volunteerIds'];
            delete (fields as any)['volunteerIds'];
            dasMeetingService
                .create(fields)
                .then(res => {
                    const atats = volunteerIds.map(vid => {
                        return {
                            fields: {
                                'Meeting': [res.id],
                                'Internal Attendee': [vid]
                            }
                        }
                    });
                    dasAttendanceService.createAttendances(atats)
                        .then(_res => {
                            // Consider requerying meeting
                            handleSuccess(res)
                        })
                })
                .catch(e => handleError(e))
        }
    }

    return (
        <AirtableRecordDialog
            open={open}
            record={{
                id: entity.id,
                fields: fields
            } as unknown as Record<FieldSet>}
            options={{
                title: 'Edit Meeting',
                inputs: inputs
            }}
            onCancel={() => handleSuccess(null)}
            onSubmit={handleSubmit}
        >
        </AirtableRecordDialog>
    )
}
export default MeetingDialog;