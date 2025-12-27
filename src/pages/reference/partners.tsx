/**
 *  reference/partners/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { useParams } from "react-router";
import {
  Divider,
  ListItemIcon,
  MenuItem
} from '@mui/material';
import { CheckOutlined } from "@ant-design/icons";

=======
>>>>>>> 4da58ec (filtering)
import { useEffect, useState } from 'react';
import { useParams } from "react-router";
import {
  Divider,
  ListItemIcon,
  MenuItem
} from '@mui/material';
import { CheckOutlined } from "@ant-design/icons";

import { EntityListPage } from '../../components/EntityListPage';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 4da58ec (filtering)
import { ListCard } from '../../components/ListCard';
import { MoreButton } from "./MoreButton";

import { Partner, PartnerService } from '../../services/dasPartnerService';
<<<<<<< HEAD
import { ReferencePartnerDetails } from '../partner/ReferencePartnerDetails';

const ReferencePartnersPage = () => {
  const partnerService = PartnerService.instance();
  const { id } = useParams<string>();

  const [entities, setEntities] = useState<Partner[]>([]);
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

  async function filteredData(): Promise<Partner[]> {
    if (PartnerService.STATUSES.includes(filter)) {
      return await partnerService
        .findByStatus(filter)
        .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    }

    if (PartnerService.TYPES.includes(filter)) {
      return await partnerService
        .findByType(filter)
        .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    }

    return await partnerService
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
      {PartnerService.STATUSES.map(status => {
        return <MenuItem
          key={status}
          onClick={() => handleFilterChange(`${status}`)}>
          <ListItemIcon>
            {filter === status && <CheckOutlined />}
          </ListItemIcon>
          {status}
        </MenuItem>
      })}
      <Divider />
      {PartnerService.TYPES.map(type => {
        return <MenuItem
          key={type}
          onClick={() => handleFilterChange(`${type}`)}>
          <ListItemIcon>
            {filter === type && <CheckOutlined />}
          </ListItemIcon>
          {type}
        </MenuItem>
      })}
    </>
  }

  function handleFilterChange(newFilter: string) {
    setFilter(newFilter);
  };
=======
import { Partner, partnerService } from '../../services/dasPartnerService';
=======
>>>>>>> 4da58ec (filtering)
import { ReferencePartnerDetails } from '../partner/ReferencePartnerDetails';

const ReferencePartnersPage = () => {
  const partnerService = PartnerService.instance();
  const { id } = useParams<string>();

  const [entities, setEntities] = useState<Partner[]>([]);
  const [filter, setFilter] = useState<string>('all');

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
>>>>>>> df7d938 (filter entity list)

  async function filteredData(): Promise<Partner[]> {
    if (PartnerService.STATUSES.includes(filter)) {
      return await partnerService
        .findByStatus(filter)
        .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    }

    if (PartnerService.TYPES.includes(filter)) {
      return await partnerService
        .findByType(filter)
        .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    }

    return await partnerService
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
      {PartnerService.STATUSES.map(status => {
        return <MenuItem
          key={status}
          onClick={() => handleFilterChange(`${status}`)}>
          <ListItemIcon>
            {filter === status && <CheckOutlined />}
          </ListItemIcon>
          {status}
        </MenuItem>
      })}
      <Divider />
      {PartnerService.TYPES.map(type => {
        return <MenuItem
          key={type}
          onClick={() => handleFilterChange(`${type}`)}>
          <ListItemIcon>
            {filter === type && <CheckOutlined />}
          </ListItemIcon>
          {type}
        </MenuItem>
      })}
    </>
  }

  function handleFilterChange(newFilter: string) {
    setFilter(newFilter);
  };

  return (
    <EntityListPage
      title={'Partners'}
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
          avatarImageSrc={partnerService.getLogoUrl(entity)} />}
      detailRenderer={entity =>
        <ReferencePartnerDetails entity={entity} />} />
  );
};

export default ReferencePartnersPage;
