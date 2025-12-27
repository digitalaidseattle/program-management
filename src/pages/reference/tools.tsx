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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 4da58ec (filtering)
import { ListCard } from '../../components/ListCard';
import { MoreButton } from './MoreButton';

import { Tool, ToolService } from '../../services/dasToolsService';
<<<<<<< HEAD
import { ReferenceToolDetails } from '../tool/ReferenceToolDetails';
import { StringUtils } from "../../services/StringUtils";

const ReferenceToolsPage = () => {
  const toolService = ToolService.instance();

  const { id } = useParams<string>();

  const [entities, setEntities] = useState<Tool[]>([]);
  const [filter, setFilter] = useState<string>('active');
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

  async function filteredData(): Promise<Tool[]> {
    if (ToolService.STATUSES.includes(filter)) {
      return await toolService
        .findByStatus(filter)
        .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    }

    return await toolService
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
      {ToolService.STATUSES.map(status => {
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
=======
import { Tool, toolService } from '../../services/dasToolsService';
=======
>>>>>>> 4da58ec (filtering)
import { ReferenceToolDetails } from '../tool/ReferenceToolDetails';

const ReferenceToolsPage = () => {
  const toolService = ToolService.instance();

  const { id } = useParams<string>();

  const [entities, setEntities] = useState<Tool[]>([]);
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

<<<<<<< HEAD
>>>>>>> df7d938 (filter entity list)
=======
  async function filteredData(): Promise<Tool[]> {
    if (ToolService.STATUSES.includes(filter)) {
      return await toolService
        .findByStatus(filter)
        .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    }

    return await toolService
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
      {ToolService.STATUSES.map(status => {
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
>>>>>>> 4da58ec (filtering)
  return (
    <EntityListPage
      title={'Tools'}
      entities={entities}
<<<<<<< HEAD
<<<<<<< HEAD
      filterBy={searchValue}
      onFilter={setSearchValue}
      pageAction={<MoreButton menuItems={filterMenu()} />}
=======
>>>>>>> df7d938 (filter entity list)
=======
      pageAction={<MoreButton menuItems={filterMenu()} />}
>>>>>>> 4da58ec (filtering)
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={toolService.getLogoUrl(entity)} />}
      detailRenderer={entity =>
        <ReferenceToolDetails
          entity={entity} />} />
  );
};

export default ReferenceToolsPage;
