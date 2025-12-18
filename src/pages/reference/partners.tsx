/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */


import { ListCard } from '../../components/ListCard';

import { useEffect, useState } from 'react';
import { EntityListPage } from '../../components/EntityListPage';
import { Partner, partnerService } from '../../services/dasPartnerService';
import { ReferencePartnerDetails } from '../partner/ReferencePartnerDetails';

const ReferencePartnersPage = () => {
  const [entities, setEntities] = useState<Partner[]>([]);

  useEffect(() => {
    fetchData()
  }, []);

  async function fetchData() {
    const found = await partnerService
      .getAll()
      .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    setEntities(found);
  }

  return (
    <EntityListPage
      title={'Partners'}
      entities={entities}
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
