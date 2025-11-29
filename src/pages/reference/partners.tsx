/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */


import { ListCard } from '../../components/ListCard';

import { EntityListPage } from '../../components/EntityListPage';
import { partnerService } from '../../services/dasPartnerService';
import { ReferencePartnerDetails } from '../partner/ReferencePartnerDetails';

const ReferencePartnersPage = () => {

  return (
    <EntityListPage
      title={'Partners'}
      fetchData={() =>
        partnerService
          .getAll()
          .then(partners => partners.sort((p1, p2) => p1.name.localeCompare(p2.name)))
      }
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
