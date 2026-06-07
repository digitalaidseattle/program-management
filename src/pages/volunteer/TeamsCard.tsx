
// material-ui
import { useStorageService } from '@digitalaidseattle/core';
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { MenuItem } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CARD_HEADER_SX } from '.';
import { toggleVolunteer2TeamLeaderFlag } from '../../actions/ToggleVolunteer2TeamLeaderFlag';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import { EntityPropsOpt } from '../../components/utils';
import { Team } from '../../data/types';
import { Team2Volunteer } from '../../services/dasTeam2VolunteerService';
import { TeamService } from '../../services/dasTeamService';
import { Volunteer, VolunteerService } from '../../services/dasVolunteerService';

export const TeamsCard: React.FC<EntityPropsOpt<Volunteer>> = ({ entity, onChange }) => {
  const teamService = TeamService.getInstance();
  const volunteerService = VolunteerService.getInstance();

  const [current, setCurrent] = useState<Team[]>([]);
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamLeads, setTeamLeads] = useState<Team[]>([]);
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
    volunteerService.findTeams(entity.id)
      .then((teams) => {
        setCurrent(teams.sort((t1, t2) => t1.name.localeCompare(t2.name)));
      })
  }

  useEffect(() => {
    setCards(createCards(current))
  }, [teams, current]);

  function createCards(teams: Team[]) {
    return teams
      .map(team => {
        return <ListCard
          key={team.id}
          title={team.name}
        // avatarImageSrc={storageService.getUrl(`icons/${t2v.team!.id}`)}
        // highlightOptions={{
        //   title: "Team Lead",
        //   highlight: team.leader ?? false,
        //   toggleHighlight: () => {
        //     onChange && toggleVolunteer2TeamLeaderFlag(t2v)
        //       .then(data => handleChange(data))
        //   }
        // }}
        // menuItems={[
        //   <MenuItem key={1} onClick={() => handleOpen(team)}> Open</MenuItem >,
        //   <MenuItem key={2} onClick={() => {
        //     setSelectedItem(team);
        //     setOpenConfirmation(true);
        //   }}>Remove...</MenuItem>
        // ]}
        />
      })
  }

  function handleChange(data: any) {
    refresh();
    onChange!(data)
  }

  function handleOpen(team: Team): void {
    navigate(`/teams/${team.id}`)
  }

  function handleAdd(selected: string | null | undefined): void {
    // const team = available.find(t => t.id === selected);
    // addVolunteerToTeam(entity, team!)
    //   .then(() => handleChange(true))
  }

  function handleRemoveConfirm(): void {
    // if (selectedItem) {
    //   removeVolunteerFromTeam(entity, selectedItem)
    //     .then(data => {
    //       handleChange(data);
    //       setOpenConfirmation(false);
    //     })
    // }
  }

  return (< >
    <ManagedListCard
      title='Teams'
      items={cards}
      headerSx={CARD_HEADER_SX}
    // addOpts={onChange && {
    //   title: 'Join Team',
    //   available: available.map(v => ({ label: v.name, value: v.id })),
    //   handleAdd: handleAdd
    // }}
    />
    <ConfirmationDialog
      title="Confirm removal from this team"
      open={openConfirmation}
      message={"Are you sure?"}
      handleConfirm={handleRemoveConfirm}
      handleCancel={() => setOpenConfirmation(false)} />
  </>)
}
