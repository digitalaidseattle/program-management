
// material-ui
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { MenuItem, Stack } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CARD_HEADER_SX } from '.';
import { ListCard } from "../../components/ListCard";
import { ManagedListCard } from '../../components/ManagedListCard';
import { EntityProps } from '../../components/utils';
import { Team2VolunteerService } from '../../services/dasTeam2VolunteerService';
import { Team } from '../../services/dasTeamService';
import { Volunteer, VolunteerService } from '../../services/dasVolunteerService';


type Member = Volunteer & {
  lead: boolean;
}

type VolunteersCardProps = EntityProps<Team> & {
  editable?: boolean
}

export const VolunteersCard: React.FC<VolunteersCardProps> = ({ entity, onChange, editable = false }) => {
  const volunteerService = VolunteerService.getInstance();
  const team2VolunteerService = Team2VolunteerService.getInstance();

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  // const [available, setAvailable] = useState<Volunteer[]>([]);
  const [cards, setCards] = useState<ReactNode[]>([]);
  const [selectedItem, setSelectedItem] = useState<Volunteer>();

  const navigate = useNavigate();

  useEffect(() => {
    volunteerService.getActive()
      .then(vols => setVolunteers(vols));
  }, []);

  useEffect(() => {
    if (entity) {
      fetchData();
    }
  }, [volunteers, entity]);

  useEffect(() => {
    console.log(members)
    setCards(createCards(members))
  }, [members]);

  function fetchData() {
    setMembers((entity.members ?? [])
      .map(m => volunteers.find(v => v.id === m.id))
      .filter(m => !!m)
      .map(v => v && {
        ...v,
        lead: (entity.leads ?? []).find(l => v.id === l.id) !== undefined
      } as Member)
      .sort((v1, v2) => v1.name.localeCompare(v2.name)))
  }

  function createCards(items: Member[]) {
    return items
      .map((member, idx) => {
        const menuItems = [<MenuItem key={'open'}
          onClick={() => handleOpen(member.id)}> Open</MenuItem >];
        if (editable) {
          menuItems.push(<MenuItem key={'remove'}
            onClick={() => {
              setSelectedItem(member);
              setOpenConfirmation(true);
            }}>Remove...</MenuItem>)
        }
        return (
          <ListCard
            key={`${idx}`}
            title={member.name}
            avatarImageSrc={(member.pic === "" || !member.pic) ? " " : member.pic}  // a blank forces the placeholder to be displayed
            menuItems={menuItems}
            cardContent={
              <Stack>
                {member.position}
              </Stack>
            }
            highlightOptions={{
              title: "Team Lead",
              highlight: member.lead,
              toggleHighlight: () => { }
            }}
          />
        )
      })
  }

  function handleChange(data: any) {
    onChange(data)
  }

  function handleOpen(volunteer_id: string): void {
    navigate(`/volunteers/${volunteer_id}`)
  }

  // function handleAdd(value: string | null | undefined): void {
  //   const selected = available.find(vol => vol.id === value);
  //   if (selected) {
  //     team2VolunteerService.addVolunteerToTeam(selected, entity!)
  //       .then(() => handleChange(true))
  //   }
  // }

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
    // addOpts={editable ? {
    //   title: 'Add volunteer',
    //   available: available.map(v => ({ label: v.name, value: v.id })),
    //   handleAdd: handleAdd
    // } : undefined}
    />
    <ConfirmationDialog
      title="Confirm removing this volunteer"
      open={openConfirmation}
      message={"Are you sure?"}
      handleConfirm={handleRemoveConfirm}
      handleCancel={() => setOpenConfirmation(false)} />
  </>)
}
