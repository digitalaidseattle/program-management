/**
 *  reference/ventures/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { ListCard } from '../../components/ListCard';

import { EntityListPage } from '../../components/EntityListPage';
import { partnerService } from '../../services/dasPartnerService';
import { ventureService } from '../../services/dasVentureService';
import { ReferenceVentureDetails } from "../venture/ReferenceVentureDetails";

const ReferenceVenturesPage = () => {

  return (
    <EntityListPage
      title={'Ventures'}
      fetchData={() => ventureService
        .getAll()
        .then(data => data.sort((a, b) => (a.venture_code.localeCompare(b.venture_code))))
      }
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.venture_code}
          avatarImageSrc={partnerService.getLogoUrl(entity.partner!)} />}
      detailRenderer={entity => <ReferenceVentureDetails entity={entity} />} />
  );
};

export default ReferenceVenturesPage;
