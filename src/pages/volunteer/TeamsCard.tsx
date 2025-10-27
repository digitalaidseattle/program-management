
// material-ui
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { Chip, MenuItem, Stack } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CARD_HEADER_SX } from '.';
import { addVolunteerToTeam } from '../../actions/AddVolunteerToTeam';
import { removeVolunteerFromTeam } from '../../actions/RemoveVolunteerFromTeam';
import { toggleVolunteer2TeamLeaderFlag } from '../../actions/ToggleVolunteer2TeamLeaderFlag';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import { EntityProps } from '../../components/utils';
import { Team2Volunteer, team2VolunteerService } from '../../services/dasTeam2VolunteerService';
import { Team, teamService } from '../../services/dasTeamService';
import { Volunteer } from '../../services/dasVolunteerService';
import { SupabaseStorage } from '../../services/supabaseStorage';

const storage = new SupabaseStorage();
const STATUS_COMP: { [key: string]: JSX.Element } = {
  'Active': <Chip label='Active' color='primary' />,
  'constant': <Chip label='Constant' color='success' />,
  'yet to begin': <Chip label='Not ready' color='warning' />,
}
export const TeamsCard: React.FC<EntityProps<Volunteer>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Team2Volunteer[]>([]);
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [available, setAvailable] = useState<Team[]>([]);
  const [cards, setCards] = useState<ReactNode[]>([]);
  const [selectedItem, setSelectedItem] = useState<Team>();

  const navigate = useNavigate();

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
          avatarImageSrc={storage.getUrl(`icons/${t2v.team!.id}`)}
          cardContent={
            <Stack>
              {t2v.team!.status
                ? STATUS_COMP[t2v.team!.status]
                : <Chip label='No status' color='default' />}
            </Stack>
          }
          highlightOptions={{
            title: "Team Lead",
            highlight: t2v.leader ?? false,
            toggleHighlight: () => {
              toggleVolunteer2TeamLeaderFlag(t2v)
                .then(data => handleChange(data))
            }
          }}
          menuItems={[
            <MenuItem onClick={() => handleOpen(t2v.team!.id)}> Open</MenuItem >,
            <MenuItem onClick={() => {
              setSelectedItem(t2v.team!);
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
      addOpts={{
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
