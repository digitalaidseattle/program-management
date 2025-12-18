/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { useStorageService } from '@digitalaidseattle/core';

import { ListCard } from '../../components/ListCard';

import { useEffect, useState } from 'react';
import { EntityListPage } from '../../components/EntityListPage';
import { Team, teamService } from '../../services/dasTeamService';
import { TeamDetails } from '../team';

const ReferenceTeamsPage = () => {
  const storageService = useStorageService()!;
  const [entities, setEntities] = useState<Team[]>([]);
  
  useEffect(() => {
    fetchData()
  }, []);

  async function fetchData() {
    const found = await teamService
      .getAll()
      .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    setEntities(found);
  }

  return (
    <EntityListPage
      title={'Teams'}
      entities={entities}
      listItemRenderer={entity => <ListCard
        key={entity.id}
        title={entity.name}
        avatarImageSrc={storageService.getUrl(`/icons/${entity.id}`)} />}
      detailRenderer={entity => <TeamDetails entity={entity} onChange={() => alert('nrfpt')} />}
    />
  );
};

export default ReferenceTeamsPage;
