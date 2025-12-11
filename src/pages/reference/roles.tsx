/**
 *  reference/roles/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */


import { ListCard } from '../../components/ListCard';

import { EntityListPage } from '../../components/EntityListPage';
import { roleService } from '../../services/dasRoleService';
import { ReferenceRoleDetails } from '../role/ReferenceRoleDetails';

const ReferenceRolesPage = () => {

  return (
    <EntityListPage
      title={'Roles'}
      fetchData={() => roleService
        .getAll()
        .then(roles => roles.sort((r1, r2) => r1.name.localeCompare(r2.name)))
      }
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
