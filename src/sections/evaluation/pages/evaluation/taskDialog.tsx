/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { useEffect, useMemo, useState } from 'react';

// material-ui
import { FieldSet, Record } from 'airtable';
import AirtableRecordDialog from '../../../../components/DASAirtableRecordDialog';
import { TaskGroup } from '../../api/dasTaskGroupService';
import { dasTaskService, DASTaskService, Task } from '../../api/dasTaskService';
import useVolunteers from '../../components/useVolunteers';


const TaskDialog: React.FC<EntityDialogProps<Task> & { taskGroup: TaskGroup }> = ({ open, entity: task, handleSuccess, handleError, taskGroup }) => {

    const volunteers = useVolunteers();
    const [dialogTitle, setDialogTitle] = useState<string>("Update Task");

    useEffect(() => {
        setDialogTitle(task.id === '' ? 'Add Task' : 'Update Task');
    }, [task]);

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
        return dasTaskService
            .update(task.id, changes)
            .then((updated: Task) => handleSuccess(updated))
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
                title: dialogTitle,
                inputs: inputs
            }}
            onCancel={() => handleSuccess(null)}
            onSubmit={handleSubmit}
        >
        </AirtableRecordDialog>
    )
}
export default TaskDialog;
