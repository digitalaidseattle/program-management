import { v4 as uuid } from 'uuid';

// material-ui
import {
    Button,
    Stack
} from '@mui/material';

import { useEffect } from 'react';
import { CodaVentureService } from '../../services/codaVentureService';
import { VentureService } from '../../services/dasVentureService';

const VentureMigrationPage = () => {
    const codaVentureService = CodaVentureService.getInstance();
    const ventureService = VentureService.instance();

    useEffect(() => {
    })

    async function migrateVentures(): Promise<void> {
        const codaVentures = await codaVentureService.getAll()
        const supaVentures = await ventureService.getAll();

        codaVentures.forEach(async cv => {
            const found = supaVentures.find(sv => sv.venture_code === cv.venture_code);
            if (found) {
                console.log('already added', found);
            } else {
                cv.id = uuid();
                const inserted = await ventureService.insert(cv);
                console.log('inserted', inserted);
            }
        });

    }

    return (
        <Stack gap={1}>
            <Button key={'ventures'} onClick={migrateVentures}>Migrate ventures</Button>
        </Stack>
    );
};

export default VentureMigrationPage;
