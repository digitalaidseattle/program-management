/**
 *  reference/roles/index.tsx
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


import { EntityListPage } from '../../components/EntityListPage';
import { ListCard } from '../../components/ListCard';
import { MoreButton } from "./MoreButton";
import { Role, RoleService } from '../../services/dasRoleService';
import { ReferenceRoleDetails } from '../role/ReferenceRoleDetails';

const ReferenceRolesPage = () => {
  const roleService = RoleService.instance();
  const { id } = useParams<string>();

  const [entities, setEntities] = useState<Role[]>([]);
  const [filter, setFilter] = useState<string>('Active');

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

  async function filteredData(): Promise<Role[]> {
    if (RoleService.STATUSES.includes(filter)) {
      return await roleService
        .findByStatus(filter)
        .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    }

    return await roleService
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
      {RoleService.STATUSES.map(status => {
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
      title={'Roles'}
      entities={entities}
      pageAction={<MoreButton menuItems={filterMenu()} />}
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={roleService.getIconUrl(entity)} />}
      detailRenderer={entity => <ReferenceRoleDetails entity={entity} />} />
  );
};

export default ReferenceRolesPage;
