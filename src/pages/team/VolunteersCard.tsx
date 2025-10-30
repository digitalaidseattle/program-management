
// material-ui
import { useStorageService } from '@digitalaidseattle/core';
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { MenuItem, Stack } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CARD_HEADER_SX } from '.';
import { toggleVolunteer2TeamLeaderFlag } from '../../actions/ToggleVolunteer2TeamLeaderFlag';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import { EntityProps } from '../../components/utils';
import { Team2Volunteer, team2VolunteerService } from '../../services/dasTeam2VolunteerService';
import { Team } from '../../services/dasTeamService';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';

export const VolunteersCard: React.FC<EntityProps<Team>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Team2Volunteer[]>([]);
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
    team2VolunteerService.findByTeamId(entity.id)
      .then((t2vs) => setCurrent(t2vs.sort((e1, e2) => e1.volunteer!.profile!.name.localeCompare(e2.volunteer!.profile!.name))))
  }

  function createCards(items: Team2Volunteer[]) {
    return items
      .map(t2v => {
        return <ListCard
          key={t2v.volunteer_id}
          title={t2v.volunteer!.profile!.name}
          avatarImageSrc={storageService.getUrl(`profiles/${t2v.volunteer!.profile!.id}`)}
          cardContent={
            <Stack>
              {t2v.volunteer!.position}
            </Stack>
          }
          highlightOptions={{
            title: "Team Lead",
            highlight: t2v.leader ?? false,
            toggleHighlight: () => {
              return toggleVolunteer2TeamLeaderFlag(t2v)
                .then(data => handleChange(data))
            }
          }}
          menuItems={[
            <MenuItem onClick={() => handleOpen(t2v.volunteer_id)}> Open</MenuItem >,
            <MenuItem onClick={() => {
              setSelectedItem(t2v.volunteer);
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

  function handleOpen(volunteer_id: string): void {
    navigate(`/volunteer/${volunteer_id}`)
  }

  function handleAdd(value: string | null | undefined): void {
    const selected = available.find(vol => vol.id === value);
    if (selected) {
      team2VolunteerService.addVolunteerToTeam(selected, entity!)
        .then(() => handleChange(true))
    }
  }

  function handleRemoveConfirm(): void {
    if (selectedItem) {
      team2VolunteerService.removeVolunteerFromTeam(selectedItem, entity!)
        .then(data => {
          handleChange(data);
          setOpenConfirmation(false);
        })
    }
  }

  return (<>
    <ManagedListCard
      title='Members'
      headerSx={CARD_HEADER_SX}
      items={cards}
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
      handleConfirm={handleRemoveConfirm}
      handleCancel={() => setOpenConfirmation(false)} />
  </>)
}
