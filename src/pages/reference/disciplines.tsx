/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { CheckOutlined } from "@ant-design/icons";
import {
  Divider,
  ListItemIcon,
  MenuItem
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from "react-router";

import { EntityListPage } from '../../components/EntityListPage';
import { ListCard } from '../../components/ListCard';
import { MoreButton } from "./MoreButton";

import { Discipline, DisciplineService } from '../../services/dasDisciplineService';
import { ReferenceDisciplineDetails } from '../discipline/ReferenceDisciplineDetails';

const ReferenceDisciplinesPage = () => {
  const disciplineService = DisciplineService.instance();
  const { id } = useParams<string>();

  const [entities, setEntities] = useState<Discipline[]>([]);
  const [filter, setFilter] = useState<string>('all');
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

  async function filteredData(): Promise<Discipline[]> {
    if (DisciplineService.STATUSES.includes(filter)) {
      return await disciplineService
        .findByStatus(filter)
        .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    }

    return await disciplineService
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
      {DisciplineService.STATUSES.map(status => {
        return <MenuItem
          key={status}
          onClick={() => handleFilterChange(`${status}`)}>
          <ListItemIcon>
            {filter === status && <CheckOutlined />}
          </ListItemIcon>
          {status}
        </MenuItem>
      })}
    </>
  }

  function handleFilterChange(newFilter: string) {
    setFilter(newFilter);
  };

  return (
    <EntityListPage
      title={'Disciplines'}
      entities={entities}
      filterBy={searchValue}
      onFilter={setSearchValue}
      pageAction={<MoreButton menuItems={filterMenu()} />}
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={disciplineService.getIconUrl(entity)} />}
      detailRenderer={entity =>
        <ReferenceDisciplineDetails entity={entity} />} />
  );
};

export default ReferenceDisciplinesPage;
