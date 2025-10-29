import { useStorageService } from "@digitalaidseattle/core";
import { ConfirmationDialog } from "@digitalaidseattle/mui";
import { Chip, MenuItem, Stack } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CARD_HEADER_SX } from ".";
import { addDisciplineToVolunteer } from "../../actions/AddDisciplineToVolunteer";
import { removeDisciplineFromVolunteer } from "../../actions/RemoveDisciplineFromVolunteer";
import { toggleVolunteer2DisciplineSeniorFlag } from "../../actions/ToggleVolunteer2DisciplineSeniorFlag";
import { ListCard } from "../../components/ListCard";
import { ManagedListCard } from "../../components/ManagedListCard";
import { EntityProps } from "../../components/utils";
import { Discipline, disciplineService } from "../../services/dasDisciplineService";
import { Volunteer2Discipline, volunteer2DisciplineService } from "../../services/dasVolunteer2DisciplineService";
import { Volunteer } from "../../services/dasVolunteerService";

const DISCIPLINE_STATUS_COMP: { [key: string]: JSX.Element } = {
    'Public': <Chip label='Public' color='success' />,
    'Internal': <Chip label='Internal' color='primary' />
}

export const DisciplinesCard: React.FC<EntityProps<Volunteer>> = ({ entity, onChange }) => {
    const [current, setCurrent] = useState<Volunteer2Discipline[]>([]);
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [desciplines, setDisciplines] = useState<Discipline[]>([]);
    const [available, setAvailable] = useState<Discipline[]>([]);
    const [cards, setCards] = useState<ReactNode[]>([]);
    const [selectedItem, setSelectedItem] = useState<Discipline>();

    const navigate = useNavigate();
    const storageService = useStorageService()!;

    useEffect(() => {
        disciplineService.getAll()
            .then(desciplines => setDisciplines(desciplines));
    }, []);

    useEffect(() => {
        if (entity) {
            volunteer2DisciplineService.findByVolunteerId(entity.id)
                .then((disciplines) => setCurrent(disciplines.sort((d1, d2) => d1.discipline!.name.localeCompare(d2.discipline!.name))))
        }
    }, [entity]);

    useEffect(() => {
        const currentIds = current.map(t => t.discipline_id);
        setAvailable(desciplines
            .filter(t => !currentIds.includes(t.id))
            .sort((t1, t2) => t1.name.localeCompare(t2.name)))
        setCards(createCards(current))
    }, [desciplines, current]);

    function refresh() {
        volunteer2DisciplineService.findByVolunteerId(entity.id)
            .then((disciplines) => setCurrent(disciplines.sort((d1, d2) => d1.discipline!.name.localeCompare(d2.discipline!.name))))
    }

    function createCards(items: Volunteer2Discipline[]) {
        return items
            .map(volunteer2Discipline => {
                const discipline = volunteer2Discipline.discipline!;
                return <ListCard
                    key={volunteer2Discipline.discipline_id}
                    title={volunteer2Discipline.discipline!.name}
                    avatarImageSrc={storageService.getUrl(`icons/${volunteer2Discipline.discipline_id}`)}
                    cardContent={
                        <Stack>
                            {discipline.status
                                ? DISCIPLINE_STATUS_COMP[discipline.status]
                                : <Chip label='No status' color='default' />}
                        </Stack>
                    }
                    highlightOptions={{
                        title: "Senior",
                        highlight: volunteer2Discipline.senior ?? false,
                        toggleHighlight: () => {
                            return toggleVolunteer2DisciplineSeniorFlag(volunteer2Discipline)
                                .then(data => handleChange(data))
                        }
                    }}
                    menuItems={[
                        <MenuItem onClick={() => handleOpen(discipline.id)}> Open</MenuItem >,
                        <MenuItem onClick={() => {
                            setSelectedItem(discipline);
                            setOpenConfirmation(true);
                        }}>Remove...</MenuItem>]
                    }
                />
            })
    }

    function handleChange(data: any) {
        refresh();
        onChange(data)
    }

    function handleOpen(discipline_id: string): void {
        navigate(`/discipline/${discipline_id}`)
    }

    function handleAdd(selected: string | null | undefined): void {
        const discipline = available.find(t => t.id === selected);
        addDisciplineToVolunteer(discipline!, entity)
            .then(() => handleChange(true))
    }

    function handleRemoveConfirm(): void {
        if (selectedItem) {
            removeDisciplineFromVolunteer(selectedItem, entity)
                .then(data => {
                    handleChange(data);
                    setOpenConfirmation(false);
                })
        }
    }

    return (< >
        <ManagedListCard
            title='Disciplines'
            items={cards}
            headerSx={CARD_HEADER_SX}
            addOpts={{
                title: 'Add Discipline',
                available: available.map(v => ({ label: v.name, value: v.id })),
                handleAdd: handleAdd
            }}
        />
        <ConfirmationDialog
            title="Confirm removing this discipline"
            open={openConfirmation}
            message={"Are you sure?"}
            handleConfirm={handleRemoveConfirm}
            handleCancel={() => setOpenConfirmation(false)} />
    </>)
}