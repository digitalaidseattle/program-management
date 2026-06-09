/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { NavLink } from 'react-router-dom';

import { CheckOutlined, HomeOutlined } from "@ant-design/icons";
import {
  Breadcrumbs,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  Typography
} from '@mui/material';
import { ListCard } from '../../components/ListCard';
import { EntityListPage } from '../../components/EntityListPage';
import { Volunteer, VolunteerService } from '../../services/dasVolunteerService';
import { ReferenceVolunteerDetails } from '../volunteer/ReferenceVolunteerDetails';
import { MoreButton } from "./MoreButton";
import { VolunteerStatusTypes } from "../../data/types";


const ReferenceVolunteersPage = () => {
  const volunteerService = VolunteerService.getInstance();

  const { id } = useParams<string>();

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filtered, setFiltered] = useState<Volunteer[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>(['Active']);
  const [rolesFilter, setRolesFilter] = useState<string[]>(['Cadre', 'Contributor']);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    volunteerService
      .getAll()
      .then(v => setVolunteers(v));
  }, []);

  useEffect(() => {
    // externally requested record, only getAll guarantees finding the record
    if (id) {
      setStatusFilter(['Active']);
    }
  }, [id]);

  useEffect(() => {
    filterData()
  }, [volunteers, statusFilter, rolesFilter, searchValue]);

  async function filterData() {
    const found = volunteers
      .filter(v => {
        const rolesSet = new Set(rolesFilter);
        return statusFilter.includes(v.status)
          && (v.roles.some(r => rolesSet.has(r)))
          && (searchValue === "" || v.name.toLowerCase().includes(searchValue))
      })
      .sort((a, b) => (a.name.localeCompare(b.name)));
    setFiltered(found);
  }

  function handleStatusChange(newFilter: string) {
    const updated = statusFilter.includes(newFilter)
      ? statusFilter.filter(e => e !== newFilter)
      : [...statusFilter, newFilter];
    setStatusFilter(updated);
  };

  function handleRolesChange(newFilter: string) {
    const updated = rolesFilter.includes(newFilter)
      ? rolesFilter.filter(e => e !== newFilter)
      : [...rolesFilter, newFilter];
    setRolesFilter(updated);
  };

  function filterMenu() {
    return <>
      {VolunteerStatusTypes.map(status =>
        <MenuItem key={status} onClick={() => handleStatusChange(status)}>
          <ListItemIcon>
            {statusFilter.includes(status) && <CheckOutlined />}
          </ListItemIcon>
          {status}
        </MenuItem>
      )}
      <Divider />
      <MenuItem onClick={() => handleRolesChange('Cadre')}>
        <ListItemIcon>
          {rolesFilter.includes('Cadre') && <CheckOutlined />}
        </ListItemIcon>
        Cadre
      </MenuItem>
      <MenuItem onClick={() => handleRolesChange('Contributor')}>
        <ListItemIcon>
          {rolesFilter.includes('Contributor') && <CheckOutlined />}
        </ListItemIcon>
        Contributor
      </MenuItem>
    </>
  }

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
        <Typography color="text.primary">Volunteers</Typography>
      </Breadcrumbs>
      <EntityListPage
        title={'Volunteers'}
        entities={filtered}
        filterBy={searchValue}
        onFilter={setSearchValue}
        pageAction={<MoreButton menuItems={filterMenu()} />}
        listItemRenderer={entity =>
          <ListCard
            key={entity.id}
            title={entity.name}
            avatarImageSrc={entity.pic} />}//profileService.getPicUrl(entity)} />}
        detailRenderer={entity => <ReferenceVolunteerDetails entity={entity} />} />
    </>
  )
};

export default ReferenceVolunteersPage;
