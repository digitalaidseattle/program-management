/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { useStorageService } from '@digitalaidseattle/core';

import { ListCard } from '../../components/ListCard';

import { EntityListPage } from '../../components/EntityListPage';
import { teamService } from '../../services/dasTeamService';
import { TeamDetails } from '../team';

const ReferenceTeamsPage = () => {
  const storageService = useStorageService()!;

  return (
    <EntityListPage
      title={'Teams'}
      fetchData={() => teamService.getAll()}
      listItemRenderer={entity => <ListCard
        key={entity.id}
        title={entity.name}
        avatarImageSrc={storageService.getUrl(`/icons/${entity.id}`)} />}
      detailRenderer={entity => <TeamDetails entity={entity} onChange={() => alert('nrfpt')} />}
    />
  );
};

export default ReferenceTeamsPage;
