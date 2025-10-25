
// material-ui
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { MenuItem, Stack } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toggleVolunteer2TeamLeaderFlag } from '../../actions/ToggleVolunteer2TeamLeaderFlag';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import SelectItemDialog from '../../components/SelectItemDialog';
import { EntityProps } from '../../components/utils';
import { Team2Volunteer, team2VolunteerService } from '../../services/dasTeam2VolunteerService';
import { Team } from '../../services/dasTeamService';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';
import { SupabaseStorage } from '../../services/supabaseStorage';
import { CARD_HEADER_SX } from '.';

const storage = new SupabaseStorage();

export const VolunteersCard: React.FC<EntityProps<Team>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Team2Volunteer[]>([]);
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [available, setAvailable] = useState<Volunteer[]>([]);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [cards, setCards] = useState<ReactNode[]>([]);
  const [selectedItem, setSelectedItem] = useState<Volunteer>();

  const navigate = useNavigate();

  useEffect(() => {
    if (entity) {
      volunteerService.getActive()
        .then(vols => setVolunteers(vols));
      team2VolunteerService.findByTeamId(entity.id)
        .then((t2vs) => setCurrent(t2vs.sort((e1, e2) => e1.volunteer!.profile!.name.localeCompare(e2.volunteer!.profile!.name))))
    }
  }, [entity]);

  useEffect(() => {
    const currentIds = current.map(t => t.volunteer_id);
    setAvailable(volunteers
      .filter(t => !currentIds.includes(t.id))
      .sort((t1, t2) => t1.profile!.name.localeCompare(t2.profile!.name)))
    setCards(createCards(current))
  }, [volunteers, current]);

  function createCards(items: Team2Volunteer[]) {
    return items
      .map(t2v => {
        return <ListCard
          key={t2v.volunteer_id}
          title={t2v.volunteer!.profile!.name}
          avatarImageSrc={storage.getUrl(`profiles/${t2v.volunteer!.profile!.id}`)}
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
                .then(data => onChange(data))
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


  function handleOpen(volunteer_id: string): void {
    navigate(`/volunteer/${volunteer_id}`)
  }

  function handleAdd(value: string | null | undefined): Promise<boolean> {
    const selected = available.find(vol => vol.id === value);
    if (selected) {
      return team2VolunteerService.addVolunteerToTeam(selected, entity!)
        .then(() => {
          onChange(true);
          setShowAddDialog(false);
          return true;
        })
    } else {
      return Promise.resolve(true)
    }
  }

  function handleRemoveConfirm(): void {
    if (selectedItem) {
      team2VolunteerService.removeVolunteerFromTeam(selectedItem, entity!)
        .then(data => onChange(data))
    }
  }

  return (<>
    <ManagedListCard
      title='Members'
      cardHeaderSx={CARD_HEADER_SX}
      items={cards}
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
      handleConfirm={handleRemoveConfirm}
      handleCancel={() => setOpenConfirmation(false)} />
  </>)
}
