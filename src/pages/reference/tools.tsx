/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { useStorageService } from '@digitalaidseattle/core';

import { ListCard } from '../../components/ListCard';

import { EntityListPage } from '../../components/EntityListPage';
import { toolService } from '../../services/dasToolsService';
import { ReferenceToolDetails } from '../tool/ReferenceToolDetails';

const ReferenceToolsPage = () => {
  const storageService = useStorageService()!;

  return (
    <EntityListPage
      title={'Tools'}
      fetchData={() => toolService.getAll()}
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={storageService.getUrl(`/logos/${entity.id}`)} />}
      detailRenderer={entity =>
        <ReferenceToolDetails
          entity={entity} />} />
  );
};

export default ReferenceToolsPage;
