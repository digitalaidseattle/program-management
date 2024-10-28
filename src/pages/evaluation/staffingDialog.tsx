/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';

// material-ui
import { FieldSet, Record } from 'airtable';
import AirtableRecordDialog from '../../components/DASAirtableRecordDialog';
import { dasAirtableService } from '../../services/airtableService';
import { DASStaffingService, dasStaffingService, StaffingNeed } from '../../services/dasStaffingService';
import useRoles from '../../services/useRoles';

const StaffingDialog: React.FC<EntityDialogProps<StaffingNeed>> = ({ open, entity: staffingNeed, handleSuccess, handleError }) => {

    const { data: roles } = useRoles();

    const fields = {
        "Status": staffingNeed.status,
        "Importance": staffingNeed.importance,
        "Timing": staffingNeed.timing,
        "Prospective Ventures": staffingNeed.ventureIds,
        "Role": staffingNeed.role,
        "Volunteer Assigned": staffingNeed.volunteerAssigned,
        "Contributor in text for website": staffingNeed.contributors
    }

    const inputs = [
        {
            name: "status",
            label: 'Status',
            fieldName: "Status",
            type: 'select',
            options: dasStaffingService.STATUSES
        },
        {
            name: "importance",
            label: 'Importance',
            fieldName: "Importance",
            type: 'select',
            options: dasStaffingService.IMPORTANCES
        },
        {
            name: "role",
            fieldName: "Role",
            label: 'Role',
            placeholder: "Project Manager",
            type: 'lookup',
            options: roles
        },
        {
            name: "contributors",
            fieldName: "Contributor in text for website",
            label: 'Volunteer Assigned',
            placeholder: "Project Manager",
            type: 'string',
            disabled: true
        }
    ]

    const handleSubmit = (changes: any) => {
        if (staffingNeed && staffingNeed.id) {
            return dasAirtableService
                .base(DASStaffingService.STAFFING_TABLE)
                .update([{
                    id: staffingNeed?.id,
                    fields: changes
                }])
                .then((resp: any) => {
                    if (resp.error) {
                        throw resp.error
                    }
                    return handleSuccess(resp[0])
                })
                .catch(e => handleError(e))
        } else {
            dasStaffingService
                .create(fields)
                .then(res => handleSuccess(res))
                .catch(e => handleError(e))
        }
    }

    return (
        <AirtableRecordDialog
            open={open}
            record={{
                id: staffingNeed.id,
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
export default StaffingDialog;
