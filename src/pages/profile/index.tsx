/**
 *  profile/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import {
    Card,
    CardHeader
} from '@mui/material';
import { useVolunteer } from '../../hooks/useVolunteer';
export const ProfilePage = () => {
    const { volunteer } = useVolunteer();
    return (volunteer &&
        <Card>
            <CardHeader title={`Profile: ${volunteer.profile!.name}`} />
        </Card>
    )
}