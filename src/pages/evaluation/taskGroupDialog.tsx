/**
 *  taskGroupDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Record } from "airtable";
import { FieldSet } from "airtable/lib/field_set";
import AirtableRecordDialog from "../../components/DASAirtableRecordDialog";
import { dasAirtableService } from "../../services/airtableService";
import { useDisciplines } from "../../services/dasDisciplinesService";
import { DASTaskGroupService, TaskGroup } from "../../services/dasTaskGroupService";
import useVolunteers from "../../services/useVolunteers";

const TaskGroupDialog: React.FC<EntityDialogProps<TaskGroup>> = ({ open, entity: taskGroup, handleSuccess, handleError }) => {
    const { data: volunteers } = useVolunteers();
    const { data: disciplines } = useDisciplines();

    const fields = {
        "Task Group name": taskGroup.name,
        "Drive URL": taskGroup.driveUrl,
        "Request details": taskGroup.requestDetails,
        "Priority": taskGroup.priority ?? '',
        "Status": taskGroup.status ?? '',
        "Responsible": taskGroup.responsibleIds,
        "Disciplines required": taskGroup.disciplinesRequiredId,
        "Venture Project Manager": taskGroup.ventureProjectManagerIds,
        "Venture Product Manager": taskGroup.ventureProductManagerIds,
        "Contributor PdM": taskGroup.contributorPdMIds
    }

    const inputs = [
        {
            name: "taskGroupName",
            label: 'Name',
            fieldName: "Task Group name",
            type: 'string'
        },
        {
            name: "priority",
            label: 'Priority',
            fieldName: "Priority",
            type: 'select',
            options: DASTaskGroupService.PRIORITIES
        },
        {
            name: "status",
            label: 'Status',
            fieldName: "Status",
            type: 'select',
            options: DASTaskGroupService.STATUSES
        },
        {
            name: "responsible",
            fieldName: "Responsible",
            label: 'Responsible',
            placeholder: "DAS Member",
            type: 'lookup',
            options: volunteers
        },
        {
            name: "ventureProjecttManager",
            fieldName: "Venture Project Manager",
            label: 'Venture Project Manager',
            placeholder: "DAS Member",
            type: 'lookup',
            options: volunteers
        },
        {
            name: "ventureProductManager",
            fieldName: "Venture Product Manager",
            label: 'Venture Product Manager',
            placeholder: "DAS Member",
            type: 'lookup',
            options: volunteers
        },
        {
            name: "contributorProductManager",
            fieldName: "Venture Project Manager",
            label: 'Venture Project Manager',
            placeholder: "DAS Member",
            type: 'lookup',
            options: volunteers
        },
        {
            name: "disciplinesRequired",
            fieldName: "Disciplines required",
            label: 'Disciplines',
            placeholder: "Developer, Project Manager",
            type: 'lookup',
            options: disciplines
        },
        {
            name: "gDrive",
            label: 'G-Drive',
            fieldName: "Drive URL",
            type: 'string'
        },
        {
            name: "requestDetails",
            label: 'Description',
            fieldName: "Request details",
            type: 'text'
        }
    ]

    const handleSubmit = (changes: any) => {
        return dasAirtableService
            .base(DASTaskGroupService.TASK_GROUP_TABLE)
            .update([{
                id: taskGroup?.id,
                fields: changes
            }])
            .then((resp: any) => {
                if (resp.error) {
                    throw resp.error
                }
                return handleSuccess(resp[0])
            })
            .catch(e => handleError(e))
    }

    return (
        <AirtableRecordDialog
            open={open}
            record={{
                id: taskGroup.id,
                fields: fields
            } as unknown as Record<FieldSet>}
            options={{
                title: 'Update Task Group',
                inputs: inputs
            }}
            onCancel={() => handleSuccess(null)}
            onSubmit={handleSubmit}
        >
        </AirtableRecordDialog>
    )

}
export default TaskGroupDialog;