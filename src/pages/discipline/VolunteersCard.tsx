
// material-ui
import { useStorageService } from '@digitalaidseattle/core';
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { Box, MenuItem, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CARD_HEADER_SX } from '.';
import { toggleVolunteer2DisciplineSeniorFlag } from '../../actions/ToggleVolunteer2DisciplineSeniorFlag';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import { EntityProps } from '../../components/utils';
import { Discipline } from '../../services/dasDisciplineService';
import { Volunteer2Discipline, volunteer2DisciplineService } from '../../services/dasVolunteer2DisciplineService';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';

export const VolunteersCard: React.FC<EntityProps<Discipline>> = ({ entity, onChange }) => {
    const [current, setCurrent] = useState<Volunteer2Discipline[]>([]);
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [available, setAvailable] = useState<Volunteer[]>([]);
    const [cards, setCards] = useState<ReactNode[]>([]);
    const [selectedItem, setSelectedItem] = useState<Volunteer>();

    const navigate = useNavigate();
    const storageService = useStorageService()!;

    useEffect(() => {
        volunteerService.getActive()
            .then(vols => setVolunteers(vols));
    }, []);

    useEffect(() => {
        if (entity) {
            refresh();
        }
    }, [entity]);

    useEffect(() => {
        const currentIds = current.map(t => t.volunteer_id);
        setAvailable(volunteers
            .filter(t => !currentIds.includes(t.id))
            .sort((t1, t2) => t1.profile!.name.localeCompare(t2.profile!.name)))
        setCards(createCards(current))
    }, [volunteers, current]);

    function refresh() {
        volunteer2DisciplineService.findByDisciplineId(entity.id)
            .then(v2ds => {
                setCurrent(v2ds
                    .filter(v2d => ['Cadre', 'Contributor'].includes(v2d.volunteer!.status))
                    .sort((v1, v2) => v1.volunteer!.profile!.last_name.localeCompare(v2.volunteer!.profile!.last_name))
                )
            })
    }

    function createCards(items: Volunteer2Discipline[]) {
        return items
            .map(t2d => {
                return <ListCard
                    cardStyles={{ width: 360, height: '100%' }}
                    key={t2d.volunteer_id}
                    title={<Box>
                        <Typography fontWeight={600}>{t2d.volunteer!.profile!.name}</Typography>
                        <Typography>{t2d.volunteer!.position}</Typography>
                    </Box>}
                    avatarImageSrc={storageService.getUrl(`profiles/${t2d.volunteer!.profile!.id}`)}
                    highlightOptions={{
                        title: "Senior",
                        highlight: t2d.senior ?? false,
                        toggleHighlight: () => {
                            return toggleVolunteer2DisciplineSeniorFlag(t2d)
                                .then(data => handleChange(data))
                        }
                    }}
                    menuItems={[
                        <MenuItem onClick={() => handleOpen(t2d.volunteer_id)}> Open</MenuItem >,
                        <MenuItem onClick={() => {
                            setSelectedItem(t2d.volunteer);
                            setOpenConfirmation(true);
                        }}>Remove...</MenuItem>]
                    }
                />
            })
    }

    function handleOpen(volunteer_id: string): void {
        navigate(`/volunteer/${volunteer_id}`)
    }

    function handleChange(data: any) {
        refresh();
        onChange(data)
    }

    function handleAdd(value: string | null | undefined): void {
        const selected = available.find(vol => vol.id === value);
        if (selected) {
            volunteer2DisciplineService.addDisciplineToVolunteer(entity!, selected)
                .then(() => handleChange(true))
        }
    }

    function handleRemove(): void {
        if (selectedItem) {
            volunteer2DisciplineService.removeDisciplineFromVolunteer(entity!, selectedItem)
                .then(data => {
                    handleChange(data);
                    setOpenConfirmation(false);
                })
        }
    }

    return (< >
        <ManagedListCard
            title='Volunteers'
            items={cards}
            headerSx={CARD_HEADER_SX}
            addOpts={{
                title: 'Add volunteer',
                available: available.map(v => ({ label: v.profile!.name, value: v.id })),
                handleAdd: handleAdd
            }}
        />
        <ConfirmationDialog
            title="Confirm removing this volunteer"
            open={openConfirmation}
            message={"Are you sure?"}
            handleConfirm={handleRemove}
            handleCancel={() => setOpenConfirmation(false)} />
    </>)
}
