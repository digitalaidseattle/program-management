
// material-ui
import { useStorageService } from '@digitalaidseattle/core';
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { MenuItem } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CARD_HEADER_SX } from '.';
import { addVolunteerToTeam } from '../../actions/AddVolunteerToTeam';
import { removeVolunteerFromTeam } from '../../actions/RemoveVolunteerFromTeam';
import { toggleVolunteer2TeamLeaderFlag } from '../../actions/ToggleVolunteer2TeamLeaderFlag';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import { EntityPropsOpt } from '../../components/utils';
import { Team2Volunteer, team2VolunteerService } from '../../services/dasTeam2VolunteerService';
import { Team, teamService } from '../../services/dasTeamService';
import { Volunteer } from '../../services/dasVolunteerService';

<<<<<<< HEAD
export const TeamsCard: React.FC<EntityPropsOpt<Volunteer>> = ({ entity, onChange }) => {
=======
export const TeamsCard: React.FC<EntityProps<Volunteer>> = ({ entity, onChange }) => {
>>>>>>> 3cd4d2f (add volunteer)
  const [current, setCurrent] = useState<Team2Volunteer[]>([]);
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [available, setAvailable] = useState<Team[]>([]);
  const [cards, setCards] = useState<ReactNode[]>([]);
  const [selectedItem, setSelectedItem] = useState<Team>();

  const navigate = useNavigate();
  const storageService = useStorageService()!;

  useEffect(() => {
    teamService.getAll()
      .then(teams => setTeams(teams));
  }, []);

  useEffect(() => {
    if (entity) {
      refresh();
    }
  }, [entity]);

  function refresh() {
    team2VolunteerService.findByVolunteerId(entity.id)
      .then((t2v) => setCurrent(t2v.sort((t1, t2) => t1.team!.name.localeCompare(t2.team!.name))))
  }

  useEffect(() => {
    const currentIds = current.map(t => t.team!.id);
    setAvailable(teams
      .filter(t => !currentIds.includes(t.id))
      .sort((t1, t2) => t1.name.localeCompare(t2.name)))
    setCards(createCards(current))

  }, [teams, current]);

  function createCards(items: Team2Volunteer[]) {
    return items
      .map(t2v => {
        return <ListCard
          key={t2v.team!.id}
          title={t2v.team!.name}
          avatarImageSrc={storageService.getUrl(`icons/${t2v.team!.id}`)}
          highlightOptions={{
            title: "Team Lead",
            highlight: t2v.leader ?? false,
            toggleHighlight: () => {
              onChange && toggleVolunteer2TeamLeaderFlag(t2v)
                .then(data => handleChange(data))
            }
          }}
<<<<<<< HEAD
          menuItems={onChange && [
            <MenuItem onClick={() => handleOpen(t2v.team!.id)}> Open</MenuItem >,
            <MenuItem onClick={() => {
=======
          menuItems={[
            <MenuItem key={1} onClick={() => handleOpen(t2v.team!.id)}> Open</MenuItem >,
            <MenuItem key={2} onClick={() => {
>>>>>>> 3cd4d2f (add volunteer)
              setSelectedItem(t2v.team!);
              setOpenConfirmation(true);
            }}>Remove...</MenuItem>
          ]}
        />
      })
  }

  function handleChange(data: any) {
    refresh();
    onChange!(data)
  }

  function handleOpen(team_id: string): void {
    navigate(`/team/${team_id}`)
  }

  function handleAdd(selected: string | null | undefined): void {
    const team = available.find(t => t.id === selected);
    addVolunteerToTeam(entity, team!)
      .then(() => handleChange(true))

  }

  function handleRemoveConfirm(): void {
    if (selectedItem) {
      removeVolunteerFromTeam(entity, selectedItem)
        .then(data => {
          handleChange(data);
          setOpenConfirmation(false);
        })
    }
  }

  return (< >
    <ManagedListCard
      title='Teams'
      items={cards}
      headerSx={CARD_HEADER_SX}
      addOpts={onChange && {
        title: 'Join Team',
        available: available.map(v => ({ label: v.name, value: v.id })),
        handleAdd: handleAdd
      }}
    />
    <ConfirmationDialog
      title="Confirm removal from this team"
      open={openConfirmation}
      message={"Are you sure?"}
      handleConfirm={handleRemoveConfirm}
      handleCancel={() => setOpenConfirmation(false)} />

  </>)
}
