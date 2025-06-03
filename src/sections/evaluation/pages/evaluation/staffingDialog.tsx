/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { useEffect, useState } from 'react';

// material-ui
import { FieldSet, Record } from 'airtable';
import AirtableRecordDialog from '../../../../components/DASAirtableRecordDialog';
import { dasStaffingService, StaffingNeed } from '../../api/dasStaffingService';
import useRoles from '../../components/useRoles';

const StaffingDialog: React.FC<EntityDialogProps<StaffingNeed>> = ({ open, entity: staffingNeed, handleSuccess, handleError }) => {

    const { data: roles } = useRoles();
    const [title, setTitle] = useState<string>('Create Venture Staffing');

    useEffect(() => {
        if (staffingNeed) {
            setTitle(staffingNeed.id ? 'Edit Venture Staffing' : 'Create Venture Staffing');
        }
    }, [staffingNeed]);

    const inputs = [
        {
            name: "importance",
            label: 'Importance',
            fieldName: "importance",
            type: 'select',
            options: dasStaffingService.IMPORTANCES
        },
        {
            name: "role",
            fieldName: "role",
            label: 'Role',
            placeholder: "Project Manager",
            type: 'lookup',
            options: roles
        },
        {
            name: "levelRequirement",
            fieldName: "levelRequirement",
            label: 'Level Requirement',
            type: 'select',
            options: dasStaffingService.EXPERIENCE_LEVELS
        },
        {
            name: "desiredSkills",
            fieldName: "desiredSkills",
            label: 'Desired Skills',
            placeholder: "SAP"
        },
        {
            name: "contributors",
            fieldName: "contributors",
            label: 'Volunteer Assigned',
            placeholder: "",
            type: 'string',
            disabled: true
        }
    ]


    const handleCancel = () => {
        handleSuccess(null);
    }

    const handleSubmit = (changes: any) => {

        if (staffingNeed && staffingNeed.id) {
            console.log(changes)
            return dasStaffingService
                .update(staffingNeed?.id, changes)
                .then(updated => handleSuccess(updated))
                .catch(e => handleError(e))
        } else {
            console.log('staffingNeed', staffingNeed, changes);
            dasStaffingService
                .insert({
                    ...staffingNeed,
                    ...changes
                })
                .then(res => handleSuccess(res))
                .catch(e => handleError(e))
        }
    }

    return (
        <AirtableRecordDialog
            open={open}
            record={{
                id: staffingNeed.id,
                fields: staffingNeed
            } as unknown as Record<FieldSet>}
            options={{
                title: title,
                inputs: inputs
            }}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
        >
        </AirtableRecordDialog>
    )
}
export default StaffingDialog;
