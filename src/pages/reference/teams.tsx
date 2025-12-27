/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useEffect, useState } from 'react';
import { useParams } from "react-router";
import {
  Divider,
  ListItemIcon,
  MenuItem
} from '@mui/material';
import { CheckOutlined } from "@ant-design/icons";

import { useStorageService } from '@digitalaidseattle/core';
import { ListCard } from '../../components/ListCard';
import { MoreButton } from "./MoreButton";
import { EntityListPage } from '../../components/EntityListPage';
import { Team, TeamService } from '../../services/dasTeamService';
import { TeamDetails } from '../team';
import { StringUtils } from '../../services/StringUtils';

const ReferenceTeamsPage = () => {
  const teamService = TeamService.instance();
  const { id } = useParams<string>();
  const storageService = useStorageService()!;

  const [entities, setEntities] = useState<Team[]>([]);
  const [filter, setFilter] = useState<string>('Active');
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    // externally requested record, only getAll guarantees finding the record
    if (id) {
      setFilter('all');
    }
  }, []);

  useEffect(() => {
    fetchData()
  }, [filter, searchValue]);

  async function fetchData() {
    const found = await filteredData();
    if (searchValue.length > 0) {
      setEntities(found.filter(elem => elem.name.toLowerCase().includes(searchValue.toLowerCase())))
    } else {
      setEntities(found);
    }
  }

  async function filteredData(): Promise<Team[]> {
    if (TeamService.STATUSES.includes(filter)) {
      return await teamService
        .findByStatus(filter)
        .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    }

    return await teamService
      .getAll()
      .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
  }

  function filterMenu() {
    return <>
      <MenuItem onClick={() => handleFilterChange('all')}>
        <ListItemIcon>
          {filter === 'all' && <CheckOutlined />}
        </ListItemIcon>
        Show All
      </MenuItem>
      <Divider />
      {TeamService.STATUSES.map(status => {
        return <MenuItem
          key={status}
          onClick={() => handleFilterChange(`${status}`)}>
          <ListItemIcon>
            {filter === status && <CheckOutlined />}
          </ListItemIcon>
          {StringUtils.capitalize(status)}
        </MenuItem>
      })}
    </>
  }

  function handleFilterChange(newFilter: string) {
    setFilter(newFilter);
  };

  return (
    <EntityListPage
      title={'Teams'}
      entities={entities}
      filterBy={searchValue}
      onFilter={setSearchValue}
      pageAction={<MoreButton menuItems={filterMenu()} />}
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={storageService.getUrl(`/icons/${entity.id}`)} />}
      detailRenderer={entity =>
        <TeamDetails entity={entity} onChange={() => alert('nrfpt')} />}
    />
  );
};

export default ReferenceTeamsPage;
