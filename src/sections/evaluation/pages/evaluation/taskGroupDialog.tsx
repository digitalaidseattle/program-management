/**
 *  taskGroupDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Record } from "airtable";
import { FieldSet } from "airtable/lib/field_set";
import AirtableRecordDialog from "../../../../components/DASAirtableRecordDialog";
import { useDisciplines } from "../../api/dasDisciplinesService";
import { dasTaskGroupService, DASTaskGroupService, TaskGroup } from "../../api/dasTaskGroupService";
import useVolunteers from "../../components/useVolunteers";

const TaskGroupDialog: React.FC<EntityDialogProps<TaskGroup>> = ({ open, entity: taskGroup, handleSuccess, handleError }) => {
    const { data: volunteers } = useVolunteers();
    const { data: disciplines } = useDisciplines();

    const inputs = [
        {
            name: "taskGroupName",
            label: 'Name',
            fieldName: "taskGroupName",
            type: 'string'
        },
        {
            name: "priority",
            label: 'Priority',
            fieldName: "priority",
            type: 'select',
            options: DASTaskGroupService.PRIORITIES
        },
        {
            name: "status",
            label: 'Status',
            fieldName: "status",
            type: 'select',
            options: DASTaskGroupService.STATUSES
        },
        {
            name: "responsible",
            fieldName: "responsible",
            label: 'Responsible',
            placeholder: "DAS Member",
            type: 'lookup',
            options: volunteers
        },
        {
            name: "ventureProjecttManager",
            fieldName: "ventureProjecttManager",
            label: 'Venture Project Manager',
            placeholder: "DAS Member",
            type: 'lookup',
            options: volunteers
        },
        {
            name: "ventureProductManager",
            fieldName: "ventureProductManager",
            label: 'Venture Product Manager',
            placeholder: "DAS Member",
            type: 'lookup',
            options: volunteers
        },
        {
            name: "contributorProductManager",
            fieldName: "contributorProductManager",
            label: 'Venture Project Manager',
            placeholder: "DAS Member",
            type: 'lookup',
            options: volunteers
        },
        {
            name: "disciplinesRequired",
            fieldName: "disciplinesRequired",
            label: 'Disciplines',
            placeholder: "Developer, Project Manager",
            type: 'lookup',
            options: disciplines
        },
        {
            name: "gDrive",
            label: 'G-Drive',
            fieldName: "gDrive",
            type: 'string'
        },
        {
            name: "requestDetails",
            label: 'Description',
            fieldName: "requestDetails",
            type: 'text'
        }
    ]

    const handleSubmit = (changes: any) => {
        return dasTaskGroupService
            .update(taskGroup?.id, changes)
            .then((updated) => handleSuccess(updated))
            .catch(e => handleError(e))
    }

    return (
        <AirtableRecordDialog
            open={open}
            record={{
                id: taskGroup.id,
                fields: taskGroup
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