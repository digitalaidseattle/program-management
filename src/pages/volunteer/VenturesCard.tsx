

import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { CheckOutlined } from "@ant-design/icons";
import { ListItemIcon, MenuItem, Stack, Typography } from '@mui/material';

import { CARD_HEADER_SX } from '.';
import { CardContainer } from '../../components/CardContainer';
import { ListCard } from '../../components/ListCard';
import { EntityPropsOpt } from '../../components/utils';
import { StaffingDao } from '../../data/coda/StaffingDao';
import { VentureDao } from '../../data/coda/VentureDao';
import { Staffing, Venture, VENTURE_STATUSES } from '../../data/types';
import { Volunteer } from '../../services/dasVolunteerService';
import { MoreButton } from '../reference/MoreButton';

type VentureStaff = {
  venture: Venture;
  staffing: Staffing;
}

export const VenturesCard: React.FC<EntityPropsOpt<Volunteer>> = ({ entity }) => {

  const [staffing, setStaffing] = useState<VentureStaff[]>([]);
  const [filtered, setFiltered] = useState<VentureStaff[]>([]);

  const [cards, setCards] = useState<ReactNode[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>(['Active']);

  const navigate = useNavigate();

  useEffect(() => {
    if (entity) {
      fetchData();
    }
  }, [entity]);

  useEffect(() => {
    filterData();
  }, [staffing, statusFilter]);

  useEffect(() => {
    setCards(createCards())
  }, [filtered]);

  async function fetchData() {
    const staffing = await StaffingDao.getInstance().findByVolunteerId(entity.id);
    const ventureStaffing: VentureStaff[] = [];
    for (let staff of staffing) {
      const venture = await VentureDao.getInstance().getById(staff.venture_id);
      ventureStaffing.push({ venture: venture!, staffing: staff });
    }
    setStaffing(ventureStaffing);
  }

  async function filterData() {
    setFiltered(staffing.filter(ventureStaff => statusFilter.includes(ventureStaff.venture.status)));
  }

  function createCards(): ReactNode[] {
    const vCards = [];
    for (let vs of filtered) {
      vCards.push(createCard(vs))
    }
    return vCards
  }

  function createCard(ventureStaff: VentureStaff): ReactNode {
    return <ListCard
      key={ventureStaff.venture.id}
      title={`${ventureStaff.venture.title} (${ventureStaff.venture.status})`}
      avatarImageSrc={ventureStaff.venture.icon}
      cardContent={
        <Stack>
          <Typography fontWeight={300}>{ventureStaff.staffing.role}</Typography>
        </Stack>
      }
      menuItems={[
        <MenuItem key='0' onClick={() => handleOpen(ventureStaff.venture.id as string)}>Open</MenuItem >,
      ]}
    />
  }

  function handleOpen(discipline_id: string): void {
    navigate(`/ventures/${discipline_id}`)
  }

  function handleStatusChange(newFilter: string) {
    const updated = statusFilter.includes(newFilter)
      ? statusFilter.filter(e => e !== newFilter)
      : [...statusFilter, newFilter];
    setStatusFilter(updated);
  };

  function filterMenu() {
    return <>
      {Object.values(VENTURE_STATUSES).map((status: VENTURE_STATUSES) =>
        <MenuItem key={status} onClick={() => handleStatusChange(status)}>
          <ListItemIcon>
            {statusFilter.includes(status) && <CheckOutlined />}
          </ListItemIcon>
          {status}
        </MenuItem>
      )}
    </>
  }

  return (< >
    <CardContainer
      title='Ventures'
      items={cards}
      headerSx={CARD_HEADER_SX}
      action={<MoreButton menuItems={filterMenu()} />}
    />
  </>)
}

