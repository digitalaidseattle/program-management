/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { useStorageService } from '@digitalaidseattle/core';

import { ListCard } from '../../components/ListCard';

import { EntityListPage } from '../../components/EntityListPage';
import { volunteerService } from '../../services/dasVolunteerService';
import { VolunteerDetails } from '../volunteer';

const ReferenceVolunteersPage = () => {
  const storageService = useStorageService()!;

  return (
    <EntityListPage
      title={'Volunteers'}
      fetchData={() => volunteerService.getActive()}
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.profile!.name}
          avatarImageSrc={storageService.getUrl(`/profiles/${entity.profile!.id}`)} />}
      detailRenderer={entity => <VolunteerDetails entity={entity} onChange={() => alert('nrfpt')} />} />
  );
};

export default ReferenceVolunteersPage;
