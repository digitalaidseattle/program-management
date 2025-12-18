/**
 *  reference/roles/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { ListCard } from '../../components/ListCard';

import { EntityListPage } from '../../components/EntityListPage';
import { Role, roleService } from '../../services/dasRoleService';
import { ReferenceRoleDetails } from '../role/ReferenceRoleDetails';
import { useEffect, useState } from 'react';

const ReferenceRolesPage = () => {
  const [entities, setEntities] = useState<Role[]>([]);

  useEffect(() => {
    fetchData()
  }, []);

  async function fetchData() {
    const found = await roleService
      .getAll()
      .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    setEntities(found);
  }

  return (
    <EntityListPage
      title={'Roles'}
      entities={entities}
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={roleService.getIconUrl(entity)} />}
      detailRenderer={entity =>
        <ReferenceRoleDetails
          entity={entity} />} />
  );
};

export default ReferenceRolesPage;
