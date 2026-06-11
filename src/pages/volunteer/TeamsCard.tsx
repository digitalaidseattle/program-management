
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import { MenuItem } from '@mui/material';

import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { CARD_HEADER_SX } from '.';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import { EntityPropsOpt } from '../../components/utils';
import { Team } from '../../data/types';
import { useTeams } from '../../hooks/useTeams';
import { Volunteer } from '../../services/dasVolunteerService';

type TeamMember = Team & {
  lead: boolean;
}

export const TeamsCard: React.FC<EntityPropsOpt<Volunteer>> = ({ entity }) => {
  const teams = useTeams();

  const [current, setCurrent] = useState<TeamMember[]>([]);
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [cards, setCards] = useState<ReactNode[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (entity) {
      fetchData();
    }
  }, [entity]);

  function fetchData() {
    const teamIds = (entity.teams ?? []).map(t => t.id);
    const teamLeadIds = (entity.team_lead ?? []).map(t => t.id);
    setCurrent((teams.data ?? [])
      .filter(t => teamIds.includes(t.id))
      .map(t => ({
        ...t,
        lead: teamLeadIds.includes(t.id)
      }))
      .sort((t1, t2) => t1.name.localeCompare(t2.name)))
  }

  useEffect(() => {
    setCards(current.map(t => createCard(t)))
  }, [current]);

  function createCard(team: TeamMember) {
    return <ListCard
      key={team.id}
      title={team.name}
      // avatarImageSrc={storageService.getUrl(`icons/${t2v.team!.id}`)}
      highlightOptions={{
        title: "Team Lead",
        highlight: team.lead ?? false,
        toggleHighlight: () => { }
      }}
      menuItems={[
        <MenuItem key={1} onClick={() => handleOpen(team)}> Open</MenuItem >,
      ]}
    />
  }

  // function handleChange(data: any) {
  //   refresh();
  //   onChange!(data)
  // }

  function handleOpen(team: Team): void {
    navigate(`/teams/${team.id}`)
  }

  // function handleAdd(selected: string | null | undefined): void {
  //   const team = available.find(t => t.id === selected);
  //   addVolunteerToTeam(entity, team!)
  //     .then(() => handleChange(true))
  // }

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
