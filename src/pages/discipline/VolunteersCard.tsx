
// material-ui
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { MenuItem, Stack } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CARD_HEADER_SX } from '.';
import { toggleVolunteer2DisciplineSeniorFlag } from '../../actions/ToggleVolunteer2DisciplineSeniorFlag';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import SelectItemDialog from '../../components/SelectItemDialog';
import { EntityProps } from '../../components/utils';
import { Discipline } from '../../services/dasDisciplineService';
import { Volunteer2Discipline, volunteer2DisciplineService } from '../../services/dasVolunteer2DisciplineService';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';
import { SupabaseStorage } from '../../services/supabaseStorage';

const storage = new SupabaseStorage();

export const VolunteersCard: React.FC<EntityProps<Discipline>> = ({ entity, onChange }) => {
    const [current, setCurrent] = useState<Volunteer2Discipline[]>([]);
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [available, setAvailable] = useState<Volunteer[]>([]);
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const [cards, setCards] = useState<ReactNode[]>([]);
    const [selectedItem, setSelectedItem] = useState<Volunteer>();

    const navigate = useNavigate();

    useEffect(() => {
        if (entity) {
            volunteer2DisciplineService.findByDisciplineId(entity.id)
                .then((v2ds) => {
                    setCurrent(v2ds)
                });
        }
    }, [entity]);

    useEffect(() => {
        if (entity) {
            volunteerService.getActive()
                .then(vols => setVolunteers(vols));
            volunteer2DisciplineService.findByDisciplineId(entity.id)
                .then(v2ds => setCurrent(v2ds));
        }
    }, [entity]);

    useEffect(() => {
        const currentIds = current.map(t => t.volunteer_id);
        setAvailable(volunteers
            .filter(t => !currentIds.includes(t.id))
            .sort((t1, t2) => t1.profile!.name.localeCompare(t2.profile!.name)))
        setCards(createCards(current))
    }, [volunteers, current]);

    function createCards(items: Volunteer2Discipline[]) {
        return items
            .map(t2d => {
                return <ListCard
                    key={t2d.volunteer_id}
                    title={t2d.volunteer!.profile!.name}
                    avatarImageSrc={storage.getUrl(`profiles/${t2d.volunteer!.profile!.id}`)}
                    cardContent={
                        <Stack>
                            {t2d.volunteer!.position}
                        </Stack>
                    }
                    highlightOptions={{
                        title: "Senior",
                        highlight: t2d.senior ?? false,
                        toggleHighlight: () => {
                            return toggleVolunteer2DisciplineSeniorFlag(t2d)
                                .then(data => onChange(data))
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

    function handleAdd(value: string | null | undefined): Promise<boolean> {
        const selected = available.find(vol => vol.id === value);
        if (selected) {
            return volunteer2DisciplineService.addDisciplineToVolunteer(entity!, selected)
                .then(() => {
                    onChange(true);
                    setShowAddDialog(false);
                    return true;
                })
        } else {
            return Promise.resolve(true)
        }
    }

    function handleRemove(): void {
        if (selectedItem) {
            volunteer2DisciplineService.removeDisciplineFromVolunteer(entity!, selectedItem)
                .then(data => onChange(data))
        }
    }
    return (< >
        <ManagedListCard
            title='Volunteers'
            items={cards}
            cardHeaderSx={CARD_HEADER_SX}
            onAdd={() => setShowAddDialog(true)}
        />
        <SelectItemDialog
            open={showAddDialog}
            options={{ title: 'Add volunteer' }}
            records={available.map(v => ({ label: v.profile!.name, value: v.id }))}
            onSubmit={handleAdd}
            onCancel={() => setShowAddDialog(false)} />
        <ConfirmationDialog
            title="Confirm removing this volunteer"
            open={openConfirmation}
            message={"Are you sure?"}
            handleConfirm={handleRemove}
            handleCancel={() => setOpenConfirmation(false)} />
    </>)
}
