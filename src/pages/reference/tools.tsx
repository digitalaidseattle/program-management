/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */


import { ListCard } from '../../components/ListCard';

import { EntityListPage } from '../../components/EntityListPage';
import { toolService } from '../../services/dasToolsService';
import { ReferenceToolDetails } from '../tool/ReferenceToolDetails';

const ReferenceToolsPage = () => {

  return (
    <EntityListPage
      title={'Tools'}
      fetchData={() => toolService.getAll()}
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={toolService.getLogoUrl(entity)} />}
      detailRenderer={entity =>
        <ReferenceToolDetails
          entity={entity} />} />
  );
};

export default ReferenceToolsPage;
