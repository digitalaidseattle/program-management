
// material-ui
import { MenuItem, Stack, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CARD_HEADER_SX } from '.';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import { EntityPropsOpt } from '../../components/utils';
import { StaffingDao } from '../../data/coda/StaffingDao';
import { Staffing } from '../../data/types';
import { Volunteer } from '../../services/dasVolunteerService';

export const VenturesCard: React.FC<EntityPropsOpt<Volunteer>> = ({ entity }) => {

  const [cards, setCards] = useState<ReactNode[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (entity) {
      fetchData();
    }
  }, [entity]);

  async function fetchData() {
    const staffing = await StaffingDao.getInstance().getAll();
    const filtered = staffing.filter(s => s.volunteer_id === entity.id);
    setCards(filtered.map(s => createCard(s)));
  }

  function createCard(staffing: Staffing) {
    return <ListCard
      key={staffing.venture_id}
      title={staffing.venture_name}
      // avatarImageSrc={storageService.getUrl(`logos/${staffing.venture!.id}`)}
      cardContent={
        <Stack>
          <Typography fontWeight={600}>{staffing.status} </Typography>
          <Typography fontWeight={300}>{staffing.role}</Typography>
        </Stack>
      }
      menuItems={[
        <MenuItem key='0' onClick={() => handleOpen(staffing.venture_id)}>Open</MenuItem >,
      ]}
    />
  }

  function handleOpen(discipline_id: string): void {
    navigate(`/ventures/${discipline_id}`)
  }

  return (< >
    <ManagedListCard
      title='Ventures'
      items={cards}
      headerSx={CARD_HEADER_SX}
    />
  </>)
}

