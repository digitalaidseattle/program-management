/**
 *  meetingDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { FieldSet, Record } from "airtable";
import AirtableRecordDialog from "../../../../components/DASAirtableRecordDialog";
import { dasAttendanceService, dasMeetingService, DASMeetingService, Meeting } from "../../api/dasMeetingService";
import useVolunteers from "../../components/useVolunteers";

const MeetingDialog: React.FC<EntityDialogProps<Meeting>> = ({ open, entity, handleSuccess, handleError }) => {

    const { data: volunteers } = useVolunteers();

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
            fieldName: "createdVia",
            type: 'select',
            options: DASMeetingService.CREATION_TYPES
        },
        {
            name: "date",
            label: 'Date',
            fieldName: "date",
            type: 'date'
        },
        {
            name: "time",
            label: 'Time',
            fieldName: "time",
            type: 'time'
        },
        {
            name: "meetingDuration",
            label: 'Meeting length',
            fieldName: "meetingDuration",
            type: 'select',
            options: DASMeetingService.DURATIONS
        },
        {
            name: "purpose",
            label: 'Purpose',
            fieldName: "purpose",
            type: 'text'
        },
        {
            name: "topics",
            label: 'Topics',
            fieldName: "topics",
            type: 'text'
        },
        {
            name: "attendees",
            fieldName: "attendees",
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
            const volunteerIds = entity.attendanceIds;
            dasMeetingService
                .create(entity)
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
                fields: entity
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