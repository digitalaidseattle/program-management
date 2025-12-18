/**
 *  VolunteerDialog.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */


import { InputFormDialog, InputOption } from '@digitalaidseattle/mui';
import { EntityDialogProps } from '../../components/utils';
import { Volunteer } from '../../services/dasVolunteerService';

interface VolunteerDialogProps extends EntityDialogProps<Volunteer> {
    title: string;
}

function VolunteerDialog({ title, open, entity, handleSuccess }: VolunteerDialogProps) {

    const inputFields: InputOption[] = [
        {
            name: 'first_name',
            label: 'First Name',
            type: 'string',
            disabled: false
        },
        {
            name: 'last_name',
            label: 'Last Name',
            type: 'string',
            disabled: false
        },
        {
            name: 'email',
            label: 'Email',
            type: 'string',
            disabled: false,
        },
        {
            name: 'phone',
            label: 'Phone',
            type: 'string',
            disabled: false,
        },
        {
            name: 'location',
            label: 'Location',
            type: 'string',
            disabled: false,
        }
    ]

    // Since volunteer is a nested object, we need to map the fields
    function mapFields(volunteer: any | null): void {
        console.log('Added volunteer', volunteer);
        if (volunteer) {
            const mapped = {
                ...entity,
                profile: {
                    ...entity.profile,
                    first_name: volunteer!.first_name || '',
                    last_name: volunteer!.last_name || '',
                    email: volunteer!.email || '',
                    phone: volunteer!.phone || '',
                    location: volunteer!.location || '',
                },
            } as Volunteer;
            handleSuccess(mapped);
        } else {
            handleSuccess(null);
        }
    }


    return (entity &&
        <InputFormDialog
            open={open}
            title={title}
            inputFields={inputFields}
            entity={entity}
            onChange={mapFields} />
    )
}
export default VolunteerDialog;


