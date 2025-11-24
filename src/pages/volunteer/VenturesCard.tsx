
// material-ui
import { useStorageService } from '@digitalaidseattle/core';
import { MenuItem, Stack, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CARD_HEADER_SX } from '.';
import { ListCard } from '../../components/ListCard';
import { ManagedListCard } from '../../components/ManagedListCard';
import { EntityProps } from '../../components/utils';
import { Staffing, staffingService } from '../../services/dasStaffingService';
import { Volunteer } from '../../services/dasVolunteerService';

export const VenturesCard: React.FC<EntityProps<Volunteer>> = ({ entity }) => {
  const [current, setCurrent] = useState<Staffing[]>([]);
  const [cards, setCards] = useState<ReactNode[]>([]);

  const navigate = useNavigate();
  const storageService = useStorageService()!;

  useEffect(() => {
    if (entity) {
      refresh();
    }
  }, [entity]);

  useEffect(() => {
    console.log(current)

    setCards(createCards(current))
  }, [current]);

  function refresh() {
    staffingService.findByVolunteerId(entity.id)
      .then((staffing) => setCurrent(staffing));
  }

  function createCards(items: Staffing[]) {
    return items
      .map(staffing => {
        console.log('staffing', staffing)
        return <ListCard
          key={staffing.venture_id}
          title={staffing.venture!.venture_code}
          avatarImageSrc={storageService.getUrl(`logos/${staffing.venture!.id}`)}
          cardContent={
            <Stack>
              <Typography fontWeight={600}>{staffing.status} :</Typography> {staffing.role?.name}
            </Stack>
          }
          menuItems={[
            <MenuItem key='0' onClick={() => handleOpen(staffing.venture!.id)}>Open</MenuItem >,
          ]}
        />
      })
  }

  function handleOpen(discipline_id: string): void {
    navigate(`/venture/${discipline_id}`)
  }

  return (< >
    <ManagedListCard
      title='Ventures'
      items={cards}
      headerSx={CARD_HEADER_SX}
    />
  </>)
}

