/**
 * 
 * StaffingPanel.tsx
 * 
 */

import { ReactNode, useEffect, useState } from "react";

import { CheckOutlined } from "@ant-design/icons";
import { Avatar, Card, CardContent, CardHeader, Chip, ListItemIcon, MenuItem } from "@mui/material";


import { CardContainer } from "../../components/CardContainer";
import { EntityProps } from "../../components/utils";
import { StaffingDao } from "../../data/coda/StaffingDao";
import { Staffing, STAFFING_STATUSES, Venture } from "../../data/types";
import { MoreButton } from "../reference/MoreButton";
import { CARD_HEADER_SX } from "./referenceVentureDetails";

const STAFFING_COMP: { [key: string]: JSX.Element } = {
  "Filled": <Chip label='Filled' color='success' />,
  "Please fill": <Chip label='Please fill' color='error' />,
  "Concluded": <Chip label='Concluded' color='default' />,
}


export const StaffingPanel: React.FC<EntityProps<Venture>> = ({ entity }) => {

  const [staffing, setStaffing] = useState<Staffing[]>([]);
  const [filtered, setFiltered] = useState<Staffing[]>([]);
  const [cards, setCards] = useState<ReactNode[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>(['Filled', 'Please fill']);

  useEffect(() => {
    if (entity) {
      fetchData();
    }
  }, [entity]);

  useEffect(() => {
    filterData();
  }, [staffing, statusFilter]);

  useEffect(() => {
    setCards(filtered.map(s => createCard(s)));
  }, [filtered]);

  async function fetchData() {
    const staffing = await StaffingDao.getInstance().getAll();
    const filtered = staffing.filter(s => s.venture_id === entity.id);
    setStaffing(filtered);
  }

  async function filterData() {
    console.log(new Set(staffing.map(s => s.status)))
    setFiltered(staffing.filter(s => statusFilter.includes(s.status)));
  }

  function createCard(staffing: Staffing) {
    return <Card key={staffing.id}
      sx={{
        boxShadow: 'none',
        minWidth: { xs: '100%', sm: '17rem' }
      }}>
      <CardHeader
        title={staffing.volunteer_name}
        subheader={staffing.role}
        avatar={<Avatar
          variant='rounded'
          src={staffing.volunteer ? staffing.volunteer.pic : undefined}
        />}
      />
      <CardContent>{STAFFING_COMP[staffing.status]}</CardContent>
    </Card>
  }


  function handleStatusChange(newFilter: string) {
    const updated = statusFilter.includes(newFilter)
      ? statusFilter.filter(e => e !== newFilter)
      : [...statusFilter, newFilter];
    setStatusFilter(updated);
  };

  function filterMenu() {
    return <>
      {Object.values(STAFFING_STATUSES).map((status: STAFFING_STATUSES) =>
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
      title='Volunteers'
      items={cards}
      headerSx={CARD_HEADER_SX}
      action={<MoreButton menuItems={filterMenu()} />}
    />
  </>)
}