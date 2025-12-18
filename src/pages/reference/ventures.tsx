/**
 *  reference/ventures/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { ListCard } from '../../components/ListCard';

import { useEffect, useState } from 'react';
import { EntityListPage } from '../../components/EntityListPage';
import { partnerService } from '../../services/dasPartnerService';
import { Venture, ventureService } from '../../services/dasVentureService';
import { ReferenceVentureDetails } from "../venture/referenceVentureDetails";

const ReferenceVenturesPage = () => {
  const [entities, setEntities] = useState<Venture[]>([]);

  useEffect(() => {
    fetchData()
  }, []);

  async function fetchData() {
    const found = await ventureService
      .getAll()
      .then(data => data.sort((a, b) => (a.venture_code.localeCompare(b.venture_code))))
    setEntities(found);
  }

  return (
    <EntityListPage
      title={'Ventures'}
      entities={entities}
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.venture_code}
          avatarImageSrc={partnerService.getLogoUrl(entity.partner!)} />}
      detailRenderer={entity => <ReferenceVentureDetails entity={entity} />} />
  );
};

export default ReferenceVenturesPage;
