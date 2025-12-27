/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { CheckOutlined } from "@ant-design/icons";
import {
  ListItemIcon,
  MenuItem
} from '@mui/material';

import { ListCard } from '../../components/ListCard';

import { useEffect, useState } from "react";
import { EntityListPage } from '../../components/EntityListPage';
import { profileService } from '../../services/dasProfileService';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';
import { ReferenceVolunteerDetails } from '../volunteer/ReferenceVolunteerDetails';
import { MoreButton } from "./MoreButton";
import { useParams } from "react-router";


const ReferenceVolunteersPage = () => {
  const { id } = useParams<string>();

  const [entities, setEntities] = useState<Volunteer[]>([]);
  const [filter, setFilter] = useState<string>('active');

  useEffect(() => {
    // externally requested record, only getAll guarantees finding the record
    if (id) {
      setFilter('all');
    }
  }, []);

  useEffect(() => {
    fetchData()
  }, [filter]);

  async function fetchData() {
    const found = await filteredData();
    setEntities(found);
  }

  async function filteredData(): Promise<Volunteer[]> {
    switch (filter) {
      case 'all':
        return volunteerService
          .getAll()
          .then(data => data.sort((a, b) => (a.profile!.name.localeCompare(b.profile!.name))))
      case 'cadre':
        return volunteerService
          .getAll()
          .then(data => data
            .filter(v => ['Cadre'].includes(v.status))
            .sort((a, b) => (a.profile!.name.localeCompare(b.profile!.name))))
      case 'contributor':
        return volunteerService
          .getAll()
          .then(data => data
            .filter(v => ['Contributor'].includes(v.status))
            .sort((a, b) => (a.profile!.name.localeCompare(b.profile!.name))))
      case 'active':
      default:
        return volunteerService
          .getActive()
          .then(data => data.sort((a, b) => (a.profile!.name.localeCompare(b.profile!.name))))
    }
  }

  function filterMenu() {
    return <>
      <MenuItem onClick={() => handleFilterChange('all')}>
        <ListItemIcon>
          {filter === 'all' && <CheckOutlined />}
        </ListItemIcon>
        Show All
      </MenuItem>
      <MenuItem onClick={() => handleFilterChange('active')}>
        <ListItemIcon>
          {filter === 'active' && <CheckOutlined />}
        </ListItemIcon>
        Active
      </MenuItem>
      <MenuItem onClick={() => handleFilterChange('cadre')}>
        <ListItemIcon>
          {filter === 'cadre' && <CheckOutlined />}
        </ListItemIcon>
        Cadre
      </MenuItem>
      <MenuItem onClick={() => handleFilterChange('contributor')}>
        <ListItemIcon>
          {filter === 'contributor' && <CheckOutlined />}
        </ListItemIcon>
        Contributor
      </MenuItem>
    </>
  }

  function handleFilterChange(newFilter: string) {
    setFilter(newFilter);
  };

  return (
    <EntityListPage
      title={'Volunteers'}
      pageAction={<MoreButton menuItems={filterMenu()} />}
      entities={entities}
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.profile!.name}
          avatarImageSrc={profileService.getPicUrl(entity.profile!)} />}
      detailRenderer={entity => <ReferenceVolunteerDetails entity={entity} />} />
  );
};

export default ReferenceVolunteersPage;
