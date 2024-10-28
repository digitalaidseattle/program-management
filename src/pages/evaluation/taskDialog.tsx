/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { useMemo } from 'react';

// material-ui
import { FieldSet, Record } from 'airtable';
import AirtableRecordDialog from '../../components/DASAirtableRecordDialog';
import { dasAirtableService } from '../../services/airtableService';
import { TaskGroup } from '../../services/dasTaskGroupService';
import { DASTaskService, Task } from '../../services/dasTaskService';
import useVolunteers from '../../services/useVolunteers';


const TaskDialog: React.FC<EntityDialogProps<Task> & { taskGroup: TaskGroup }> = ({ open, entity: task, handleSuccess, handleError, taskGroup }) => {

    const volunteers = useVolunteers();

    const fields = {
        "The request": task.title,
        "Phase": task.phase,
        "Request details": task.requestDetails,
        "DRI": task.driId,
        "DRI Email": task.driEmail,
        "Status": task.status,
        "Due date": task.dueDate
    }

    // ONLY Responsible volunteers are eligible
    const lookup = (volunteers: any, task: Task, taskGroup: TaskGroup) => {
        if (volunteers.status === 'fetched' && taskGroup && task) {
            return volunteers.data
                .filter((v: any) => taskGroup.responsibleIds.includes(v.id)
                    || (task.driId && task.driId.includes(v.id)))
        }
    }

    const taskGroupVolunteers = useMemo(
        () => lookup(volunteers, task, taskGroup),
        [volunteers, task, taskGroup]
    )

    const inputs = [
        {
            name: "title",
            label: 'Title',
            fieldName: "The request",
            type: 'string'
        },
        {
            name: "dri",
            label: 'DRI',
            fieldName: "DRI",
            placeholder: "DAS Member",
            type: 'lookup',
            options: taskGroupVolunteers
        },
        {
            name: "status",
            label: 'Status',
            fieldName: "Status",
            type: 'select',
            options: DASTaskService.TASK_STATUSES

        },
        {
            name: "phase",
            label: 'Phase',
            fieldName: "Phase",
            type: 'select',
            options: DASTaskService.TASK_PHASES
        },
        {
            name: "dueDate",
            label: 'Due Date',
            fieldName: "Due date",
            type: 'date'
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
            .base(DASTaskService.TASK_DETAIL_TABLE)
            .update([{
                id: task?.id,
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

    return (taskGroupVolunteers &&
        <AirtableRecordDialog
            open={open}
            record={{
                id: task.id,
                fields: fields
            } as unknown as Record<FieldSet>}
            options={{
                title: 'Update Task',
                inputs: inputs
            }}
            onCancel={() => handleSuccess(null)}
            onSubmit={handleSubmit}
        >
        </AirtableRecordDialog>
    )
}
export default TaskDialog;
