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
            fieldName: "title",
            type: 'string'
        },
        {
            name: "dri",
            label: 'DRI',
            fieldName: "dri",
            placeholder: "DAS Member",
            type: 'lookup',
            options: taskGroupVolunteers
        },
        {
            name: "status",
            label: 'Status',
            fieldName: "status",
            type: 'select',
            options: DASTaskService.TASK_STATUSES

        },
        {
            name: "phase",
            label: 'Phase',
            fieldName: "phase",
            type: 'select',
            options: DASTaskService.TASK_PHASES
        },
        {
            name: "dueDate",
            label: 'Due Date',
            fieldName: "dueDate",
            type: 'date'
        },
        {
            name: "requestDetails",
            label: 'Description',
            fieldName: "requestDetails",
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
                fields: task
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
