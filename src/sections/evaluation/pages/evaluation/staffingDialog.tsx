/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';

// material-ui
import { FieldSet, Record } from 'airtable';
import AirtableRecordDialog from '../../../../components/DASAirtableRecordDialog';
import { dasStaffingService, StaffingNeed } from '../../api/dasStaffingService';
import useRoles from '../../components/useRoles';

const StaffingDialog: React.FC<EntityDialogProps<StaffingNeed>> = ({ open, entity: staffingNeed, handleSuccess, handleError }) => {

    const { data: roles } = useRoles();

    const fields = {
        "Status": staffingNeed.status,
        "Importance": staffingNeed.importance,
        "Timing": staffingNeed.timing,
        "Prospective Ventures": staffingNeed.ventureIds,
        "Role": staffingNeed.role,
        "Volunteer Assigned": staffingNeed.volunteerAssigned,
        "Contributor in text for website": staffingNeed.contributors,
        "Level requirement": staffingNeed.levelRequirement,
        "Desired skills": staffingNeed.desiredSkills
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
            name: "levelRequirement",
            fieldName: "Level requirement",
            label: 'Level Requirement',
            type: 'select',
            options: dasStaffingService.EXPERIENCE_LEVELS
        },
        {
            name: "desiredSkills",
            fieldName: "Desired skills",
            label: 'Desired Skills',
            placeholder: "SAP"
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

    const handleCancel = () => {
        handleSuccess(null);
    }

    const handleSubmit = (changes: any) => {
        console.log('handleSubmit', changes)

        if (staffingNeed && staffingNeed.id) {
            console.log('handleSubmit', staffingNeed)
            return dasStaffingService
                .update(staffingNeed?.id, changes)
                .then(updated => handleSuccess(updated))
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
                title: 'Edit Venture Staffing',
                inputs: inputs
            }}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
        >
        </AirtableRecordDialog>
    )
}
export default StaffingDialog;
