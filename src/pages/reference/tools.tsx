/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { useStorageService } from '@digitalaidseattle/core';

import { ListCard } from '../../components/ListCard';

import { EntityListPage } from '../../components/EntityListPage';
import { Tool, toolService } from '../../services/dasToolsService';
import { ReferenceToolDetails } from '../tool/ReferenceToolDetails';
import { useEffect, useState } from 'react';

const ReferenceToolsPage = () => {
  const [entities, setEntities] = useState<Tool[]>([]);
  const storageService = useStorageService()!;

  useEffect(() => {
    fetchData()
  }, []);

  async function fetchData() {
    const found = await toolService
      .getAll()
      .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    setEntities(found);
  }

  return (
    <EntityListPage
      title={'Tools'}
      entities={entities}
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
