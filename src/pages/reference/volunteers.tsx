/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */


import { ListCard } from '../../components/ListCard';

import { EntityListPage } from '../../components/EntityListPage';
import { profileService } from '../../services/dasProfileService';
import { volunteerService } from '../../services/dasVolunteerService';
import { ReferenceVolunteerDetails } from '../volunteer/ReferenceVolunteerDetails';

const ReferenceVolunteersPage = () => {

  return (
    <EntityListPage
      title={'Volunteers'}
      fetchData={() => volunteerService
        .getActive()
        .then(data => data.sort((a, b) => (a.profile!.name.localeCompare(b.profile!.name))))
      }
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.profile!.name}
          avatarImageSrc={profileService.getPicUrl(entity.profile!)} />}
      detailRenderer={entity => <ReferenceVolunteerDetails entity={entity} />} />
  );
};

export default ReferenceVolunteersPage;
